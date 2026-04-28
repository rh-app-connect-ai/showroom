# Writing Guide — Documentation Preferences

This file captures the author's preferences for writing workshop documentation. Follow these guidelines when creating or editing content pages.

## General Principles

- **Keep things simple.** Don't over-explain or over-engineer the documentation.
- **Commands must be clear, clean, short, and informational.** Never use commands that hang — always include timeouts or safeguards (e.g. `--connect-timeout 3`).
- **Every step should feel smooth.** Design the exercise so the student flows through it without friction or confusion.
- **Just enough, not more.** Don't add extra commands or steps that repeat information the student already has. If they've already seen the output, don't make them inspect it again in a different format.

## Chapter Flow and Section Structure

- **Each section should be bounded** — it covers one concept, and its ending naturally leads into the next section. This applies across pages too — the closing of one page should set up the opening of the next.
- **Avoid formulaic headings** like "The Problem" / "The Solution". Use natural, varied headings that tell the student what they're about to learn (e.g. "Why can't you reach the database?", "Bridging namespaces with Service Interconnect").
- **Revisit opening lines when the chapter evolves.** Intro sentences set the reader's expectations for everything that follows. When a chapter's structure, content, or flow changes, re-read the opening to make sure it still accurately frames what the student will do — stale intros mislead.
- **Never place two headings back-to-back.** After a main chapter title (`==`), always add a short introductory sentence that sets context before the first subsection (`===`). Follow it with `{empty} +` for spacing.
- **Diagrams across sections should be additive.** If a diagram introduces elements (e.g. a service node), subsequent diagrams should keep those elements and only add new ones. Don't remove pieces between diagrams — it confuses the student.

## Diagrams (Mermaid)

- **Prefer horizontal layout (`flowchart LR`)** for all diagrams unless there's a specific reason for vertical. Horizontal diagrams are shorter on the page and prevent endless scrolling — this is critical for the student's navigation experience.
- Keep diagrams minimal — only show what's relevant to the concept being explained.
- Don't include internal details (like Network Policies) unless the student interacts with them directly. Show the effect, not the implementation.
- Don't introduce implementation details (like Listener, Connector) too early — start with the high-level concept first.
- Use concise labels. Prefer "DB Client" over "Apache Camel" when the specific technology isn't the point.
- Use small node shapes (e.g. circles `(( ))`) for secondary elements like services.
- **Progressive disclosure through diagrams**: build understanding across multiple diagrams in a chapter. Start with the problem (e.g. blocked connection), then the high-level solution, then explode into details. Each diagram is additive.
- **Color-coded task diagrams**: when showing what the student needs to create vs what's pre-configured, use color coding with emoji labels (✅ done, ✏️ to do) and a legend below. Use orange (`fill:#fff3e0,stroke:#fb8c00`) for student tasks and green (`fill:#e8f5e9,stroke:#66bb6a`) for pre-configured items.
- **Sequence diagrams** for process flows (e.g. grant/token exchange): use `actor` for the student, dashed lines (`-->>`) for user directives, and solid lines (`->>`) for system actions. Keep participant labels simple when surrounding text already provides context.
- **Conceptual language over infrastructure jargon.** Prefer "secure, air-tight environment" over "namespace" or "isolated namespace" when describing where a service lives. The student should understand the *concept* without needing to know the platform detail.
- **Namespace labels without overlap**: wrap the inner subgraph in a transparent parent subgraph that carries the label. The parent uses `fill:none,stroke:none` to stay invisible, while the child uses `[" "]` for no label. This avoids label collision with nested subgraphs (e.g. Site containers).

## Commands and Copypaste Blocks

- Copypaste blocks contain the command as-is — no AsciiDoc line continuations (`+`) or `{blank}` needed inside them.
- Add a `{blank}` between introductory text and a copypaste block or `++++`/`<pre>` output block to avoid them rendering too close together.
- When introducing a command, briefly explain why (e.g. "use `curl` as a simple way to test connectivity").
- Use `-v` (verbose) over `-s` (silent) when the output is educational and helps the student understand what's happening.
- **Escape reserved AsciiDoc symbols** inside copypaste blocks. The `[.copypaste]` pattern uses sidebar blocks (`****`), which parse content as AsciiDoc. Characters like `*` (bold), `_` (italic), `` ` `` (monospace), and `#` (highlight) will be consumed by the parser. Wrap the content in `+++` (triple-plus passthrough) to preserve them literally. Avoid `pass:[]` when the content contains `]` characters (e.g. `[@key='user']`) — AsciiDoc will close the passthrough at the first `]`:
  ```asciidoc
  [.copypaste]
  ****
  +++concat("*", field[@key='user'], ":* ", value)+++
  ****
  ```

## Explaining Commands

- Use a foldable (collapsible) section to explain commands — keeps the flow clean for students who don't need the explanation.
- Wrap the collapsible inside a `[TIP]` admonition block.
- Use bullet points to break down command parts — not inline prose with values buried in sentences.
- Format: `` `flag or argument` — short description ``

Example:
```asciidoc
[TIP]
--
.What does this command do?
[%collapsible]
====
* `postgres.shared-database.svc:5432` — target service, namespace, and PostgreSQL port
* `-v` — verbose, shows the connection attempt
* `--connect-timeout 3` — gives up after 3 seconds instead of hanging
====
--
```

## Expected Output

- Show expected terminal output after commands so students know what to expect.
- When output includes `{username}`, use a generic placeholder like `userN` to keep column alignment consistent across different username lengths.
- Use `++++` passthrough blocks (not `pass:[]`) with dark `<pre>` styling for terminal output:

```asciidoc
++++
<pre style="background-color: #272822; padding: 10px 15px; line-height: 1.4; white-space: pre-wrap; font-family: monospace; font-size: 14px; color: white">command output here</pre>
++++
```

## Chapter Endings

- **Every chapter must end with a verification block** (`[.verification]`) that asks the student to confirm their work before moving on.
- The question should reference a concrete, observable result (e.g. specific output, a visible resource, a status).
- The `[.success]` message should acknowledge completion and lead into the next exercise.
- The `[.fail]` message should guide the student on what to review.

## Punctuation

- **Avoid em dashes (`--`).** They are overused in AI-generated text and feel unnatural. Use commas, colons, periods, or parentheses instead. Classic punctuation reads better.

## Spacing and Layout

- Use `{empty} +` for vertical spacing between sections.
- Use `{blank}` to add a small gap between introductory text and a copypaste block.
- Don't add excessive spacing — just enough to keep sections visually distinct.
