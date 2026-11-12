---
name: ps-update
description: Update the Przeskalowani setup to the newest version from GitHub, both the plugin with these skills and the Przeskalowani design system. Use only when the user asks to update, sync, refresh or check the version of the Przeskalowani plugin, skills or design system, such as "zaktualizuj", "aktualizacja", "/ps-update" or "czy mam najnowszą wersję".
disable-model-invocation: true
---

# Przeskalowani: update

Plugin version: v1.0.11

The Przeskalowani setup has two parts, and each updates differently:

- **The plugin** (these skills) is installed from the marketplace
  `przeskalowani-design-system`. The line above is only the version of **this copy of
  the skill**, which may not be the installed plugin: inside a clone of the
  repository, the clone's copy runs instead. With a terminal, always check the
  installed plugin as step 1 describes.
- **The design system** (tokens, CSS, templates, assets) lives in Claude, under
  Settings > Capabilities > Design systems. Its version is the line at the top of
  its README: `Version: vX.Y.Z · from gorskip/ps-design-system at <commit>`.

Both come from the public repository `gorskip/ps-design-system`.

**Never read the newest version from a `.../main/...` address.** GitHub caches
`https://raw.githubusercontent.com/gorskip/ps-design-system/main/VERSION` and can serve
an old version for a long time after a merge, and adding a query string such as
`?nocache=1` doesn't get past that cache. Read it by commit instead:

1. Get the newest commit on `main` from
   `https://api.github.com/repos/gorskip/ps-design-system/commits/main`. It is the
   `sha` field at the top of the reply.
2. Read `https://raw.githubusercontent.com/gorskip/ps-design-system/<sha>/VERSION`,
   with the full `sha` in place of `main`. That address always gives the file as it
   is in that commit.

If the API can't be reached, open `https://github.com/gorskip/ps-design-system` and
take the newest commit from that page. Use the same `<sha>` address for every other
file you read from the repository in this run.

Work through the steps below on your own, without asking questions, and finish with
the short report in step 4. Never change anything in the repository.

## 1. Check the versions

1. Read the newest version by commit, as described above, and note the commit.
2. The installed plugin's version:
   - **With a terminal,** run `claude plugin list --json` and find the entry whose
     `id` is `przeskalowani@przeskalowani-design-system`. Its `version` field, such as
     `1.0.5`, is the installed version. Never use the `Plugin version` line instead.
     If there is no such entry, the plugin isn't installed from that marketplace
     (it may come from the user's claude.ai account): say so.
   - **Without a terminal,** use the `Plugin version` line above.
3. The design system's version is the `Version:` line at the top of its README, if
   this conversation can see the design system. Otherwise it is unknown.

Compare them as numbers: v1.0.10 is newer than v1.0.9. If the installed plugin still
looks newer than GitHub, check that you read `VERSION` by commit and not from `main`.
If it is still newer, it is a copy that isn't merged yet: say so and change nothing.

## 2. Update the plugin

**With a terminal (Claude Code: the Code tab or the CLI),** first make sure the
plugin keeps itself up to date. Do this every time, even when the plugin is already
current. Claude Desktop has no switch for it, so it lives in one file:

1. Open `~/.claude/settings.json`. If it doesn't exist, create it with `{}`.
2. In the `extraKnownMarketplaces` object, find the `przeskalowani-design-system`
   entry. If the object or the entry is missing, add it with the source
   `"source": { "source": "git", "url": "https://github.com/gorskip/ps-design-system.git" }`.
3. In that entry, set `"autoUpdate": true`. Keep an existing source as it is.
4. Change nothing else in the file: the other settings, their order and their
   indentation stay the same. Check that the file is still valid JSON after saving.
5. If `"autoUpdate": true` was already there, leave the file untouched.

Then, when the installed version from step 1 is older than the newest one, update
it. Run both commands, in this order: the first fetches the newest catalog, without
which the second finds nothing new.

```sh
claude plugin marketplace update przeskalowani-design-system
claude plugin update przeskalowani@przeskalowani-design-system
```

**Check that it worked.** Run `claude plugin list --json` again and read the
`version` of `przeskalowani@przeskalowani-design-system`. It must equal the newest
version. If it doesn't:

1. Run both commands once more.
2. If the version is still old, run
   `claude plugin uninstall przeskalowani@przeskalowani-design-system`, then
   `claude plugin install przeskalowani@przeskalowani-design-system`, and check
   again.
3. If it is still old, stop and report the version you see and the output of the
   last command. Never report the plugin as updated until `claude plugin list --json`
   shows the newest version.

If a command says the plugin isn't installed from that marketplace, the plugin came
from the user's claude.ai account instead: say so and use the steps below. When the
update succeeds, tell the user to run `/reload-plugins` or start a new session,
because the running session keeps the old skills.

**Without a terminal (a regular chat).** You can't update the plugin or turn on its
automatic updates from here. When the plugin is behind, tell the user to do it
themselves:

- In Claude Desktop: Customize > Plugins > Add > Manage marketplaces, then ⋯ next
  to `przeskalowani-design-system` and **Check for updates**.
- A plugin added through claude.ai updates on its own; it can take a little while.

Then they open a new chat.

## 3. Update the design system

Skip this step when the design system's version equals the newest one.

**If this conversation can edit the Przeskalowani design system** (it is that design
system's own chat, opened from Settings > Capabilities > Design systems > Manage >
Przeskalowani Design System > Chat), update it in place:

1. From the design system's README, note the commit it came from. Read the commits on
   `main` of `gorskip/ps-design-system` from that commit up to the newest one you
   found in step 1, and read every file at that newest commit's `<sha>` address. Without a commit, compare
   everything.
2. Bring over the changes to the styles, merging them with what is already there
   rather than rebuilding:
   - tokens from `tokens/`,
   - CSS from `ps-design-system.css`, `base/`, `components/`, `patterns/`,
     `social/social.css` and `documents/documents.css`, with file paths changed to
     this design system's assets,
   - templates from `social/instagram`, `social/linkedin`, `slides/typy`,
     `documents/typy` and `forms`, under their file names,
   - new or changed photos, logos, fonts and QR codes from `assets/`.
3. Don't bring over the skills or any `SKILL.md`: the plugin carries the rules. If
   the design system holds rules copied from `SKILL.md` files in an earlier version,
   remove them from its README and its Social, Slides, Documents, Forms and Website
   sections, and keep the descriptions of the styles.
4. Apart from that, delete only styles the repository no longer has.
5. Set the line at the top of its README to
   `Version: <VERSION> · from gorskip/ps-design-system at <short commit>`.
6. Save everything in this design system. Update it in place; never create a new one.

**Otherwise,** you can't update it from here. Tell the user to open Settings >
Capabilities > Design systems > Manage > Przeskalowani Design System > Chat and type
`/ps-update` there. If the skill isn't offered in that chat, they paste the update
prompt from the spec page, in the section *Aktualizacja*.

## 4. Report

Reply in Polish, in at most six lines:

- the newest version and its short commit,
- automatic updates: turned on now, already on, or not possible here,
- the plugin: its installed version before and after, or what the user has
  to do,
- the design system: its version before, and whether it's updated now or what the
  user has to do,
- for an updated design system, up to five words each on what was added, changed and
  removed, and anything that couldn't be brought over.

Never claim something was updated unless you did it in this conversation and it
succeeded.
