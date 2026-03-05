# Project Notes

## Antora Image Alignment

Antora's theme renders `.imageblock` as a flex column with `align-items: center`, which visually centers images even without an explicit align attribute. The `align=` attribute on image macros does not work with Antora. Custom CSS in `partials/style.adoc` fixes this:

- **Left-aligned (default)**: `align-items: flex-start !important` on `.imageblock` overrides the theme's centering. No role needed — images left-align by default.
- **Centered**: Use the `[.text-center]` role. CSS forces `.content` to full width with `text-align: center`, and sets the `img` to `display: inline-block` so text-align takes effect.

```asciidoc
// Left-aligned (default, no role needed)
image::intro/my-image.png[width=40%]

// Centered
[.text-center]
image::intro/my-image.png[width=60%]
```

Note: Do NOT use `align=center` or `align=left` on image macros — they have no effect in Antora.

## Antora Image Paths

Each `.adoc` file sets `:imagesdir: ../../assets/images` pointing to `content/modules/ROOT/assets/images/`. Image paths in macros are relative to that directory, using the subfolder name matching the module section (e.g. `intro/`).

```asciidoc
image::intro/my-image.png[width=60%]
```

Do NOT use `images/new/` — that was a legacy path from the previous documentation system and does not match the actual directory structure.

## Antora Image Width Migration

When migrating image `width` values from the old walkthrough system to Antora, the percentages need adjustment. Antora's content frame is wider than the old system, so smaller images look disproportionately small if widths are kept as-is. Larger images are less affected.

Apply the following adjustments:

| Old width | New width | Adjustment |
|-----------|-----------|------------|
| 30%       | 50%       | +20pp      |
| 40%       | 60%       | +20pp      |
| 60%       | 70%       | +10pp      |
| 80%       | 80%       | no change  |
| 90%       | 90%       | no change  |
| 100%      | 100%      | no change  |

Notes:
- Very low-resolution images (e.g. under ~500px wide) may need extra width beyond the table.
- No image should become 100% unless it was originally 100%.
- Always verify visually after applying the table — these are guidelines, not exact rules.

## Admonitions After File Listings

When an admonition (NOTE, TIP, etc.) appears directly below a file/directory listing inside an open block, do NOT add extra vertical spacing (`{empty} +` or `{blank}`) between the listing and the admonition. Instead, indent the admonition to align with the file listing by applying the `[.indent2]` role.

```asciidoc
--
[.indent2]
📁 workshop +
&nbsp;&nbsp;📁 lab +
&nbsp;&nbsp;&nbsp;&nbsp;📁 m2r +
pass:[<mark ...>] *m2r.camel.yaml* +
pass:[<mark ...>] matrix.properties +
pass:[<mark ...>] rocketchat.properties +

[.indent2]
NOTE: Make sure the files are visible in your file explorer.
--
```

The `[.indent2]` class (defined in `partials/style.adoc`) applies `padding-left: 2rem`, which aligns the admonition with the file listing content above it.

## HTML `<img>` Tags in Passthrough Blocks

AsciiDoc `image::` macros and raw HTML `<img>` tags resolve paths differently in Antora. Each `.adoc` file that contains HTML `<img>` tags must define:

```asciidoc
:imageshtml: ../_images/
```

This points to the `_images/` directory as served in the generated Antora site. Use it in HTML `<img>` tags so the path mirrors the AsciiDoc pattern:

```html
<!-- HTML passthrough -->
<img src="{imageshtml}m1-new/my-image.jpg" style="max-width:100%"/>
```

```asciidoc
// AsciiDoc macro (for comparison — uses :imagesdir:)
image::m1-new/my-image.jpg[width=60%]
```

Always include `style="max-width:100%"` on HTML `<img>` tags to prevent overflow beyond the container. Additional width/style constraints can be added as needed (e.g. `style="width:50%; max-width:100%"`).

## Inline Code Styling

Inline code (backtick `` `code` ``) uses a light blue background (`#DDF4FF`) and monospace font, defined globally in `partials/style.adoc`:

```css
.doc code:not([style]) {
  background-color: #DDF4FF !important;
  font-family: monospace !important;
}
```

The `:not([style])` selector ensures this only applies to AsciiDoc-generated inline code (from backticks). Passthrough `<code>` elements with explicit inline styles (e.g. the blue `To do: Mapping` badges) are excluded, preserving their custom colors.

Inside admonitions, inline code and copypaste textareas also use adjusted backgrounds for consistency:

```css
.doc .admonitionblock code {
  background-color: #DDF4FF !important;
}
.admonitionblock textarea {
  background-color: #ddd !important;
}
```

No action needed per file — all rules are handled globally in `partials/style.adoc`.

## Terminal Output `<pre>` Blocks in Passthrough

The old documentation system applied CSS for `pre` blocks via a basic element selector. In Antora, the theme's more specific selectors override this, breaking the dark terminal look and font.

Fix: add all styling as inline styles directly on the `<pre>` tag:

```html
<pre style="background-color: #272822; padding: 10px 15px; line-height: 1.4; white-space: pre-wrap; font-family: monospace; font-size: 14px; color: white">
```

Key inline styles and why they're needed:
- `background-color: #272822` — dark terminal background (theme overrides basic element selectors)
- `padding: 10px 15px` — matches the copypaste textarea padding for visual consistency
- `line-height: 1.4` — prevents lines from nearly overlapping (the default `1` is too tight)
- `font-family: monospace` — Antora's theme overrides the font; without this the block uses a non-monospace font
- `font-size: 14px` — matches the copypaste textarea font size
- `color: white` — text color for dark background

## Copy-to-Clipboard Blocks

Use `[.copypaste]` sidebar blocks for all copy-to-clipboard blocks. The pattern is defined in `partials/patterns/copypaste.adoc` and must be included in pages that use it.

**Static (no fetch):**
```asciidoc
[.copypaste]
****
some command here
****
```

**Dynamic (docserver fetch with custom default):**
```asciidoc
[.copypaste]
****
[.path]
/credentials/im/{user-username}

[.default]
fallback-password

REPLACE
****
```

**Dynamic (docserver fetch with built-in default):**
```asciidoc
[.copypaste]
****
[.path]
/credentials/im/{user-username}

REPLACE
****
```

Role paragraphs inside the block:
- `[.path]` — URL path appended to `{url-docserver}` for fetching data. If present, the block is dynamic.
- `[.default]` — comma-separated fallback values to replace `REPLACE` tokens when the server is unavailable (optional). If omitted, each `REPLACE` token shows `<unavailable>`.
- Remaining paragraphs = the template content. Multiple paragraphs (separated by blank lines) are joined with `\n\n`. `REPLACE` tokens are substituted with fetched or default values.

Default value cascade:
1. **Immediate**: all `REPLACE` tokens are replaced with `<unavailable>` (built-in)
2. **If `[.default]` provided**: author's values override the built-in
3. **On fetch success**: server data overwrites everything
4. **On fetch failure**: whatever's showing stays

The old `{copypaste}` attribute and its helpers (`{fcopy}`, `{fdocserver}`, `{freplace}`, `{snippet}`, `{room}`, `{cp-btn}`, `{btn-paste}`, `{pen-btn}`) have been removed. All pages now use the `[.copypaste]` sidebar block syntax.

## Antora Theme CSS Overrides

Antora's theme uses specific selectors that override basic element selectors (e.g. `kbd`, `pre`). When migrating styles that don't take effect, add them to the main `<style>` block in `partials/style.adoc` with `.doc` prefix for higher specificity. For example, `kbd` styling is defined as `.doc kbd { ... }` to override the theme. Inline styles on HTML elements (as with `<pre>` terminal blocks) also work since they have highest priority.

## Migration: Removed Legacy Attributes

The following attributes from the old documentation system have been removed and should be deleted when migrating pages:

- **`{style-all}`**: Was used on every page after the section heading to inject inline CSS. All those styles now live in the main `<style>` block in `partials/style.adoc` and are applied globally — remove `{style-all}` from migrated pages.
- **`{style-kbd}`, `{style-preview}`, `{style-indent}`, `{style-open-close}`** and sub-attributes (`{style-summary}`, `{style-triangle}`, `{style-details}`): These were the components of `{style-all}`. All removed — their CSS rules are now in `partials/style.adoc`.
- **`{copypaste}` and helpers** (`{fcopy}`, `{fdocserver}`, `{freplace}`, `{snippet}`, `{room}`, `{cp-btn}`, `{btn-paste}`, `{pen-btn}`): Replaced by the `[.copypaste]` sidebar block syntax (see Copy-to-Clipboard Blocks).
- **`{docserver-status}`**: Was an `<img onerror>` hack for the status indicator. Replaced by `partials/patterns/docserver-status.adoc`, a clean `DOMContentLoaded` script.

## Task Sidebar (Resources Overlay)

The old `[type=taskResource]` sidebar blocks are replaced by a collapsible `.task-sidebar` overlay, defined in `partials/vars/sidebar.adoc` (included via `partials/style.adoc`). It appears on every page.

Key design decisions:
- Uses HTML `<details>/<summary>` for native collapse/expand behavior
- Positioned with `position: fixed; top: 12rem; right: 1rem` — below the doc-sidebar (`top: 6.5rem`) with a thin gap
- Background matches Antora's sidebarblock color (`#e1e1e1`)
- Both overlays use `border-radius: 4px` for consistent corners and right-edge alignment
- The summary text is `text-align: right` so "Resources ▾" stays pinned to the right edge when expanded content grows to the left
- The `.task-sidebar` container has `padding: 0` so its right edge aligns exactly with the doc-sidebar
- URL attributes (`url-element`, `url-rocketchat`, etc.) are defined in `partials/vars/urls.adoc` so they're available globally — no need to repeat them in individual page files

## TOC and Fixed Overlays

Antora's right-side TOC (`.toc.sidebar .toc-menu`) uses `position: sticky; top: 6rem` by default. The fixed overlays (doc-sidebar at `6.5rem`, task-sidebar at `12rem`) occupy the same area. To prevent the TOC from scrolling behind the overlays, `partials/style.adoc` overrides the TOC sticky position:

```css
.toc.sidebar .toc-menu {
  top: 16rem !important;
}
```

The old `.toc { display: none !important }` rule was removed to allow the TOC to show. If the overlay heights change, the TOC `top` value may need adjustment to stay below them.

## Partials Architecture

The `partials/` directory is a self-contained portable package providing the look-and-feel (CSS theme), reusable AsciiDoc patterns (copypaste, verification, tiles), and project-specific variables (URLs, icons, sidebar overlays). It can be copied to any new showroom project.

```
content/modules/ROOT/
  partials/
    style.adoc              # portable CSS + style attributes + :experimental:
                            # includes vars/* and patterns/all.adoc — single entry point
    vars/
      icons.adoc            # SVG icon attributes (portable as-is)
      urls.adoc             # URL attributes, module labels (customize per project)
      sidebar.adoc          # doc-sidebar block + task-sidebar HTML overlay (customize per project)
    patterns/
      all.adoc              # master include: all patterns below (included via style.adoc)
      docserver-status.adoc # hydrates .doc-sidebar with fetch status
      progress.adoc         # tracks page visits, resume URLs, overrides cross-module prev links
      copypaste.adoc        # [.copypaste] sidebar blocks
      verification.adoc     # [.verification] sidebar blocks
      tiles.adoc            # [.tile] sidebar blocks (dynamic time/tasks from nav + fetch)
      steps.adoc            # steps overview overlay on first tile click
      celebration.adoc      # module completion overlay
      README.md             # documentation
```

**Pattern**: Each pattern uses AsciiDoc sidebar blocks with a role (e.g. `[.copypaste]`), CSS `display: none` to hide raw blocks, and a `DOMContentLoaded` JS handler to query, transform, and replace them.

**Porting to a new project:**
1. Copy `partials/` to the new project's `content/modules/ROOT/partials/`
2. Edit `vars/urls.adoc` — update `:url-docserver:`, `:url-element:`, `:url-rocketchat:`, etc. for the new environment
3. Edit `vars/sidebar.adoc` — update the Resources overlay links and labels to match the new project's services
4. `style.adoc`, `vars/icons.adoc`, and all `patterns/` files are portable as-is

**Page boilerplate:**

Every page only needs `include::partial$style.adoc[]` — this includes all vars, patterns, and CSS automatically. Subdirectory pages also set `:imagesdir:`. Pages with `:page-time:` must define it before the include.

```asciidoc
// Root-level page (e.g. pages/index.adoc)
include::partial$style.adoc[]

// Subdirectory page (e.g. pages/m1/m1.2.adoc)
:imagesdir: ../../assets/images
include::partial$style.adoc[]

// Subdirectory page with page-time (e.g. pages/m2/m2.4.adoc)
:imagesdir: ../../assets/images
:page-time: 8
include::partial$style.adoc[]
```

**Creating a new pattern:**
1. Create `partials/patterns/newpattern.adoc` with a `++++` passthrough block containing `<style>` and `<script>`
2. Use `[subs=attributes]` on the passthrough if the pattern needs AsciiDoc attributes (e.g. `{url-docserver}`)
3. Hide raw blocks: `.sidebarblock.newpattern { display: none; }`
4. In JS: query `.sidebarblock.newpattern`, extract content from `.paragraph` children, build replacement HTML, replace original
5. Use prefixed CSS classes (e.g. `np-tooltip`) to avoid collisions with other patterns
6. Add `include::./newpattern.adoc[]` to `all.adoc`

**`[subs=attributes]` gotcha:** When a passthrough block uses `[subs=attributes]`, AsciiDoc resolves `{name}` patterns — including inside JavaScript. This means JS template literals like `` `${color}` `` will have `{color}` treated as an AsciiDoc attribute reference. If the attribute is undefined, the line may be silently dropped, breaking the script. Use string concatenation (`'...' + color + '...'`) instead of template literals to avoid this.

## Verification Blocks

Interactive "Check your work" components that gate the Next page link until the user selects "Yes". Defined in `partials/patterns/verification.adoc`.

```asciidoc
[.verification]
****
Did you see the message in _Matrix_ showing up in _Rocket.Chat_?

[.success]
Finish this chapter by completing the next task.

[.fail]
Review your steps in the exercise and try again.
****
```

- First paragraph = the question (shown with Yes/No radio buttons)
- `[.success]` paragraph = message shown when user selects Yes (default: "Great, you may continue to the next section.")
- `[.fail]` paragraph = message shown when user selects No (default: "Review your steps and try again.")
- Success and fail paragraphs are optional — defaults are used if omitted
- When all verification blocks on a page have "Yes" selected, Antora's Next page link is enabled; otherwise it's disabled (`pointer-events: none; opacity: 0.3`)
- CSS class `.sidebarblock.verification { display: none }` prevents flash of unstyled content before JS runs

Used in: `m1/m1.2`, `m1/m1.3`, `m2/m2.1`, `m2/m2.4` (x2), `intro/intro.3`.

## Page Time Attribute

Each page can declare an estimated completion time using the `:page-time:` document attribute. This value is rendered into the HTML as a hidden `<span>` by `partials/style.adoc`, and read by the tile and steps overlay JS to compute dynamic totals.

```asciidoc
:imagesdir: ../../assets/images
:page-time: 5
include::partial$style.adoc[]
```

**Critical: `:page-time:` must be defined BEFORE `include::partial$style.adoc[]`.** The style partial contains an `ifdef::page-time[]` block that renders the hidden span. If the attribute is defined after the include, the `ifdef` evaluates before the attribute exists, and the span is never rendered — all times silently default to 1 min.

Pages without `:page-time:` default to 1 min in the JS calculations.

**Passthrough and attribute substitution:** The hidden span uses a `[subs=attributes]` passthrough block, not `pass:[]`. The `pass:[]` inline macro suppresses all substitutions, so `{page-time}` would be output literally instead of resolved. Always use `[subs=attributes]` on `++++` blocks when attribute values need to be rendered into HTML.

## Tile Blocks (Index Page)

Grid-based module cards for the index/landing page. Defined in `partials/patterns/tiles.adoc`.

```asciidoc
[.tile]
****
xref:m1/m1.0.adoc[Lab 1 -- Be the Camel developer]

Description text for the tile card.
****
```

- First paragraph must contain an `xref:` link — the link href becomes the card's click target, the link text becomes the card header
- Middle paragraphs = description text shown in the card body
- **Time and task count are fully dynamic** — computed at runtime from the nav sidebar (task count = number of nav links matching the module prefix) and by fetching each page to read its `.page-time` hidden span (total time = sum of per-page times)
- `[.meta]` paragraphs are ignored — do not use them for time/tasks
- JS collects all `.sidebarblock.tile` elements, wraps them in a `.tile-grid` CSS grid container, and replaces each with a `.tile-card`
- Cards have a green header bar (`#3e8635`), hover shadow effect, and responsive grid layout (`repeat(auto-fill, minmax(280px, 1fr))`)
- CSS class `.sidebarblock.tile { display: none }` prevents flash of unstyled content

To add a new module tile, just add another `[.tile]` block in `index.adoc`.

## Steps Overlay

A fullscreen overlay that shows the list of pages in a module with per-page estimated times when a tile is first clicked. Defined in `partials/patterns/steps.adoc`.

- Triggered by clicking a tile card that has no `resume:` entry in localStorage (first visit)
- Tiles with a resume URL skip the overlay and navigate directly
- Module name comes from the tile header; page titles come from nav links matching the module prefix; per-page times come from `data-times` JSON set by tiles.adoc's background fetch
- "Get Started" button navigates to the module's first page (`data-first-link`)
- Uses `[subs=attributes]` for the Red Hat background SVG (`{ico-redhat-dark}`)
- CSS classes are prefixed `steps-*` to avoid collisions
- Must be included after `tiles.adoc` (both use `window.addEventListener('DOMContentLoaded', ...)` and fire in registration order)
