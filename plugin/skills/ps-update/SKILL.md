---
name: ps-update
description: Update the Przeskalowani setup to the newest version from GitHub, both the plugin with these skills and the Przeskalowani design system. Use only when the user asks to update, sync, refresh or check the version of the Przeskalowani plugin, skills or design system, such as "zaktualizuj", "aktualizacja", "/ps-update" or "czy mam najnowszą wersję".
disable-model-invocation: true
---

# Przeskalowani: update

Plugin version: v1.0.10

The Przeskalowani setup has two parts, and each updates differently:

- **The plugin** (these skills) is installed from the marketplace
  `przeskalowani-design-system`. Its version is the line above.
- **The design system** (tokens, CSS, templates, assets) lives in Claude, under
  Settings > Capabilities > Design systems. Its version is the line at the top of
  its README: `Version: vX.Y.Z · from gorskip/ps-design-system at <commit>`.

Both come from the public repository `gorskip/ps-design-system`. Its newest version is
in `https://raw.githubusercontent.com/gorskip/ps-design-system/main/VERSION`.

Work through the steps below on your own, without asking questions, and finish with
the short report in step 4. Never change anything in the repository.

## 1. Check the versions

1. Read the newest version from the `VERSION` URL above.
2. The plugin's version is the `Plugin version` line above.
3. The design system's version is the `Version:` line at the top of its README, if
   this conversation can see the design system. Otherwise it is unknown.

Compare them as numbers: v1.0.10 is newer than v1.0.9. A plugin newer than GitHub
is a copy that isn't merged yet: say so and change nothing.

## 2. Update the plugin

Skip this step when the plugin version equals the newest one.

**With a terminal (Claude Code: the Code tab or the CLI).** Run:

```sh
claude plugin marketplace update przeskalowani-design-system
claude plugin update przeskalowani@przeskalowani-design-system
```

If the second command says the plugin isn't installed from that marketplace, the
plugin came from the user's claude.ai account instead: say so and use the steps
below. When the update succeeds, tell the user to run `/reload-plugins` or start a
new session, because the running session keeps the old skills.

**Without a terminal (a regular chat).** You can't update the plugin from here.
Tell the user to do it themselves:

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
   `main` of `gorskip/ps-design-system` since that commit. Without a commit, compare
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

- the newest version,
- the plugin: its version before, and whether it's updated now or what the user has
  to do,
- the design system: its version before, and whether it's updated now or what the
  user has to do,
- for an updated design system, up to five words each on what was added, changed and
  removed, and anything that couldn't be brought over.

Never claim something was updated unless you did it in this conversation and it
succeeded.
