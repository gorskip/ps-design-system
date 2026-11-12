#!/usr/bin/env python3
"""Remove the background from an image and save a transparent PNG.

    python3 remove_bg.py <in> <out.png> [--subject person|object] [--engine auto|vision|rembg]
                         [--model NAME] [--no-crop]

Engines, in the order `auto` tries them:
  rembg   Anywhere with Python (Claude chat sandbox, macOS, Linux, Windows).
          Installs itself with pip if it is missing. Models download once:
            person -> birefnet-portrait  (~970 MB, cleanest hair and edges)
            object -> isnet-general-use  (~180 MB)
          If the big model can't load, falls back to u2net_human_seg / u2net.
  vision  macOS 14+ only, offline fallback. Apple Vision ("Copy Subject" in
          Photos). No download, but leaves a soft halo of the old background.

An input that already has real transparency is kept as it is (only cropped):
a proper cut-out always beats a model's guess.

Prints one JSON line: {"ok": true, "out": ..., "engine": ..., "size": [w, h]}.
Built on rembg (MIT, github.com/danielgatis/rembg); the CLI shape follows
michaelboeding/skills background-remove (MIT).
"""
import argparse, json, os, platform, shutil, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
PERSON_MODELS = ["birefnet-portrait", "u2net_human_seg"]
OBJECT_MODELS = ["isnet-general-use", "u2net"]


def fail(msg):
    print(json.dumps({"ok": False, "error": msg}))
    sys.exit(1)


def ensure_pillow():
    try:
        import PIL  # noqa: F401
    except ImportError:
        try:
            pip_install("pillow")
        except RuntimeError as e:
            fail(str(e))


def pip_install(*pkgs):
    cmd = [sys.executable, "-m", "pip", "install", "-q", *pkgs]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:  # PEP 668 sandboxes refuse a plain install
        r = subprocess.run(cmd + ["--break-system-packages"], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"pip install {' '.join(pkgs)} failed: {r.stderr.strip()[-400:]}")


def has_real_alpha(img):
    if img.mode not in ("RGBA", "LA", "PA") and "transparency" not in img.info:
        return False
    lo, _ = img.convert("RGBA").getchannel("A").getextrema()
    return lo < 250


def vision_available():
    if platform.system() != "Darwin" or not shutil.which("osascript"):
        return False
    try:
        return int(platform.mac_ver()[0].split(".")[0]) >= 14
    except ValueError:
        return False


def run_vision(src, dst):
    # Vision reads JPEG/PNG/HEIC; hand it a PNG to be safe.
    from PIL import Image
    tmp = Path(tempfile.mkdtemp(prefix="cutout-")) / "src.png"
    Image.open(src).convert("RGB").save(tmp)
    r = subprocess.run(["osascript", "-l", "JavaScript", str(HERE / "lift-subject.js"), str(tmp), str(dst)],
                       capture_output=True, text=True)
    out = (r.stdout or r.stderr).strip()
    if not out.startswith("ok"):
        raise RuntimeError(f"vision: {out or 'no output'}")


def run_rembg(src, dst, models):
    try:
        import rembg  # noqa: F401
    except ImportError:
        pip_install("rembg[cpu]")
    from rembg import new_session, remove
    from PIL import Image
    img = Image.open(src).convert("RGB")
    errors = []
    for name in models:
        try:
            session = new_session(name)
            remove(img, session=session, post_process_mask=True).save(dst)
            return name
        except Exception as e:  # download blocked, out of memory, ...
            errors.append(f"{name}: {e}")
    raise RuntimeError("rembg: " + " | ".join(errors))


def crop_to_alpha(path):
    from PIL import Image
    img = Image.open(path).convert("RGBA")
    box = img.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        fail("nothing left after removal: the model found no subject")
    img.crop(box).save(path)
    return img.crop(box).size


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("src")
    p.add_argument("out")
    p.add_argument("--subject", choices=["person", "object"], default="person")
    p.add_argument("--engine", choices=["auto", "vision", "rembg"], default="auto")
    p.add_argument("--model", help="force one rembg model, e.g. birefnet-general")
    p.add_argument("--no-crop", action="store_true", help="keep the original canvas size")
    a = p.parse_args()

    src, out = Path(a.src).expanduser().resolve(), Path(a.out).expanduser().resolve()
    if not src.exists():
        fail(f"not found: {src}")
    if out.suffix.lower() != ".png":
        fail("output must be .png (transparency)")
    out.parent.mkdir(parents=True, exist_ok=True)
    ensure_pillow()
    from PIL import Image

    engine = None
    if has_real_alpha(Image.open(src)):
        Image.open(src).convert("RGBA").save(out)
        engine = "kept (input already transparent)"
    else:
        errors = []
        if a.engine in ("auto", "rembg"):
            models = [a.model] if a.model else (PERSON_MODELS if a.subject == "person" else OBJECT_MODELS)
            try:
                engine = "rembg/" + run_rembg(src, out, models)
            except Exception as e:  # pip blocked, download blocked, out of memory, ...
                errors.append(str(e))
        if engine is None and a.engine in ("auto", "vision"):
            if vision_available():
                try:
                    run_vision(src, out)
                    engine = "vision"
                except Exception as e:
                    errors.append(str(e))
            elif a.engine == "vision":
                fail("vision needs macOS 14 or newer")
        if engine is None:
            fail("; ".join(errors) or "no engine available")

    size = Image.open(out).size if a.no_crop else crop_to_alpha(out)
    print(json.dumps({"ok": True, "out": str(out), "engine": engine, "size": list(size)}))


if __name__ == "__main__":
    main()
