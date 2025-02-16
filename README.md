## Work In Progress

A fast, compact HTML renderer that avoids a virtual DOM by leveraging string template literals. Inspired by `lit-html` and `uhtml`, it's designed as a drop-in replacement for a forked version of `uhtml` in another project.

- [] Attributes
    - [x] Events - @click
        - [] @click.stop and @click.prevent if possible :thinking:
    - [] Props - :propname
    - [] Add model binding - `~model` - can call it what ever I want with current implementation :)
    - [] Native Attributes - bind as string

- [] Rendering
    - [x] Render html
    - [] Render Lists
        - [x] Simple naive rendering
        - [] Keyed diffing
            - [] I hate keyed implementation it's enforces setting keys on lists :(
            - [] Allow fallback to array index as key
            - [] Look in to `LIS` algorithm
            - [] Cache list in the Map with a key for instant O(1) access when updating the DOM
        - [] Add repeat directive just as `lit-html` does
    - [] TemplateHole
        - [x] Render Lists => html`${list.map(...)}`
        - [] Render instances of `HtmlTemplate` => html`...`
        - [] Allow string rendering => html`Loading...`

- [] Testing (keep to absolute necessity)
    - [] Avoid stupid monkey tests!
    - [] Simple tests for list rendering

- [] Transform it in to a librarY
