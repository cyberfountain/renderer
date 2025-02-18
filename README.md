## Work In Progress

A fast, compact HTML renderer that avoids a virtual DOM by leveraging string template literals. Inspired by `lit-html` and `uhtml`, it's designed as a drop-in replacement for a forked version of `uhtml` in another project.

- [] Attributes
    - [x] Events - @click
        - [] @click.stop and @click.prevent if possible :thinking:
        - [] Keep in-line events for now `onclick` etc. when this becomes and issue swap to `addEventListener` - will probably never come to that :thinking:
    - [] Props - :propname - bind directly to an exposed prop handler in my framework
    - [] Add direct props - .propname - ability to set properties directly on `HTML Nodes`
    - [] Add model binding - `~model` - can call it what ever I want with current implementation :tada:
        - [] Model binding based on name of the attribute `~value` etc.
    - [] Native Attributes - bind as string
    - [] Make sure attributes are getting parsed correctly when using `'`, `"` or none for example: `@click=${clickHandler}`

- [] Refactoring
    - [] Refactor list renderer and diffing - class ?? :thinking:

- [] Rendering
    - [x] Render html
    - [x] Render Lists
        - [x] Simple naive rendering
        - [x] Keyed diffing
            - [x] I hate keyed implementation it's enforces setting keys on lists :sad: - sorted with auto keying :tada:
            - [x] Allow fallback to array index as key - sorted with auto keying :tada:
            - [x] Look in to `LIS` algorithm
            - [x] Cache list in the Map with a key for instant O(1) access when updating the DOM
        - [x] Add repeat directive just as `lit-html` does
        - [x] Nested Lists
        - [x] DOM manipulation based on diff result :fire:
            - [x] Render all elements (without diffing)
            - [x] Remove all elements (without a diffing)
                - [x] Not ideal ATM implementation follows what needs to be done in case of diff result, this is not efficient way of clearing DOM nodes :thinking: - fixed with `ListHole` type :tada:
            - [x] Diffing Results
                - [x] Deletions
                - [x] Swaps
                - [x] Inserts
        - [] Any possible performance gains ?? This is already faster than it needs be :thinking:

    - [] Allow rendering self closing tags `<div />`
    - [] Holes
        - [x] Render Lists => html`${list.map(...)}`
        - [x] Add new hole for list rendering `ListHole`
        - [] Render instances of `HtmlTemplate` => html`...`
            - [] Use `TemplateHole` for this
        - [] Allow string rendering => html`Loading...`
            - [] Add `StringHole` for this
        - [] Conditional rendering (check caches, templates holes etc. to avoid memory leaks :siren:)

- [] Testing (keep to absolute necessity)
    - [] Avoid stupid monkey tests!
    - [] Simple tests for list rendering

- [] Transform it in to a library
