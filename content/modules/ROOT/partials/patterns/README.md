# Patterns

Interactive UI components for AsciiDoc pages. Each pattern is a self-contained `.adoc` file with CSS and JS inside a passthrough block. Pages include only the patterns they need.

## Including patterns

```asciidoc
include::partial$patterns/copypaste.adoc[]
include::partial$patterns/verification.adoc[]
```

Or include all patterns at once:

```asciidoc
include::partial$patterns/all.adoc[]
```

> Every page must also include `style.adoc` (global CSS, attributes, overlays) before any pattern includes.

---

## Copypaste

Copy-to-clipboard blocks with an optional docserver fetch for dynamic values.

**File:** `copypaste.adoc`

### Static block

Displays fixed content with a copy button.

```asciidoc
[.copypaste]
****
oc get pods -n demo
****
```

### Multi-line static block

Paragraphs separated by blank lines are joined with `\n\n` in the textarea.

```asciidoc
[.copypaste]
****
# Kafka configuration
camel.component.kafka.brokers=localhost:9092
camel.component.kafka.group-id=my-group
****
```

### Dynamic block (docserver fetch)

Fetches data from the docserver and replaces `REPLACE` tokens with the response. Each `REPLACE` is replaced in order with comma-separated values from the server.

```asciidoc
[.copypaste]
****
[.path]
/credentials/im/{user-username}

REPLACE
****
```

### Dynamic block with custom defaults

If the server is unavailable, `[.default]` values are shown instead of the built-in `<unavailable>`.

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

### Dynamic block with multiple tokens

Multiple `REPLACE` tokens are substituted in order. Defaults are comma-separated.

```asciidoc
[.copypaste]
****
[.path]
/configuration/matrix/{user-username}

[.default]
fallback-token, fallback-room

# Matrix credentials
matrix.token=REPLACE
matrix.room=REPLACE
****
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `[.path]` | No | URL path appended to `{url-docserver}`. Makes the block dynamic. |
| `[.default]` | No | Comma-separated fallback values for `REPLACE` tokens when the server is unavailable. If omitted, `<unavailable>` is used. |
| Content paragraphs | Yes | The template text. `REPLACE` tokens are substituted with fetched or default values. |

### Default value cascade

1. All `REPLACE` tokens are immediately replaced with `<unavailable>` (built-in)
2. If `[.default]` is provided, its values override the built-in
3. On successful fetch, server data overwrites everything
4. On fetch failure, whatever is currently displayed stays

### Context compatibility

Copypaste blocks work inside:
- Admonitions (use compound syntax: `[NOTE]` with `====` delimiters)
- Example blocks
- Open blocks
- Ordered and unordered lists (with `+` continuation)
- Collapsible blocks (`[%collapsible]`)
- Tables (use `a|` cell type)
- Nested structures (e.g. admonition inside example block)
- Multiple blocks in sequence

---

## Verification

"Check your work" components that gate the Next page link until the user selects "Yes" on all verification blocks.

**File:** `verification.adoc`

### Basic usage

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

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| First paragraph | Yes | The question shown with Yes/No radio buttons. |
| `[.success]` | No | Message shown when user selects Yes. Default: "Great, you may continue to the next section." |
| `[.fail]` | No | Message shown when user selects No. Default: "Review your steps and try again." |

### Behavior

- Renders as a green-header card with Yes/No radio buttons
- Selecting "Yes" shows the success message; "No" shows the fail message
- Antora's Next page link is disabled until **all** verification blocks on the page have "Yes" selected
- Multiple verification blocks on a single page are supported

### Used in

`intro/intro.3`, `m1/m1.2`, `m1/m1.3`, `m2/m2.1`, `m2/m2.4`

---

## Tiles

Grid-based module cards for index/landing pages.

**File:** `tiles.adoc`

### Usage

```asciidoc
[.tile]
****
xref:m1/m1.0.adoc[Lab 1 -- Be the Camel developer]

Description text for the tile card.

[.meta]
29 min | 5 tasks
****
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| First paragraph (with `xref:`) | Yes | The link href becomes the card's click target; the link text becomes the card header. |
| Middle paragraphs | No | Description text shown in the card body. |
| `[.meta]` | No | Footer with time and task count, separated by `\|`. |

### Behavior

- All `.tile` blocks on a page are collected into a responsive CSS grid
- Cards have a green header bar (`#3e8635`), hover shadow, and responsive layout
- Grid uses `repeat(auto-fill, minmax(280px, 1fr))`

### Used in

`index.adoc`

---

## Creating a new pattern

1. Create `partials/patterns/newpattern.adoc` with a `++++` passthrough block containing `<style>` and `<script>` sections
2. Use `[subs=attributes]` on the passthrough block if the pattern needs AsciiDoc attributes resolved (e.g. `{url-docserver}`)
3. Hide raw sidebar blocks with CSS: `.sidebarblock.newpattern { display: none; }`
4. In JS, add a `DOMContentLoaded` handler that queries `.sidebarblock.newpattern`, extracts content from `.paragraph` children, builds replacement HTML, and replaces the original block
5. Use prefixed CSS classes (e.g. `np-tooltip`) to avoid collisions with other patterns
6. Add `include::./newpattern.adoc[]` to `all.adoc`

### Architecture pattern

All patterns follow the same structure:

```
AsciiDoc sidebar block    →    CSS hides it    →    JS transforms it on DOMContentLoaded
   [.rolename]                  display: none         querySelectorAll → build HTML → replaceChild
   ****
   content...
   ****
```

Role paragraphs inside the block (e.g. `[.path]`, `[.success]`, `[.meta]`) act as named parameters — they become CSS classes on the rendered `.paragraph` divs, which JS can query with `classList.contains()`.
