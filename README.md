## Work In Progress

A fast, compact HTML renderer that avoids a virtual DOM by leveraging string template literals. Inspired by `lit-html` and `uhtml`, it's designed as a drop-in replacement for a forked version of `uhtml` in another project.

- [] Attributes
    - [x] Events - @click
        - [] @click.stop and @click.prevent if possible :thinking:
        - [] Keep in-line events for now `onclick` etc. when this becomes and issue swap to `addEventListener` - will probably never come to that :thinking:
    - [] Props - :propname - bind directly to an exposed prop handler in my framework
    - [] Add model binding - `~model` - can call it what ever I want with current implementation :tada:
    - [] Native Attributes - bind as string

- [] Rendering
    - [x] Render html
    - [] Render Lists
        - [x] Simple naive rendering
        - [x] Keyed diffing
            - [x] I hate keyed implementation it's enforces setting keys on lists :sad: - sorted with auto keying :tada:
            - [x] Allow fallback to array index as key - sorted with auto keying :tada:
            - [x] Look in to `LIS` algorithm
            - [x] Cache list in the Map with a key for instant O(1) access when updating the DOM
        - [x] Add repeat directive just as `lit-html` does
        - [] DOM manipulation based on diff result :fire:
            - [x] Render all elements (without diffing)
            - [x] Remove all elements (without a diffing)
                - [x] Not ideal ATM implementation follows what needs to be done in case of diff result, this is not efficient way of clearing DOM nodes :thinking: - fixed with `ListHole` type :tada:
            - [] Diffing Results
                - [] Deletions
                - [] Swaps
                - [] Inserts
    - [] Holes
        - [x] Render Lists => html`${list.map(...)}`
        - [x] Add new hole for list rendering `ListHole`
        - [] Render instances of `HtmlTemplate` => html`...`
        - [] Allow string rendering => html`Loading...`
        - [] Conditional rendering (check caches, templates holes etc. to avoid memory leaks :siren:)

- [] Testing (keep to absolute necessity)
    - [] Avoid stupid monkey tests!
    - [] Simple tests for list rendering

- [] Transform it in to a library
