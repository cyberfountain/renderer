import type { ElementWithCache } from "./element";
import type { Hole } from "./holes/Hole";
import { parse, hydrateFragment } from "./parser";

export type TemplateFragmentResults = {
  fragment: DocumentFragment;
  holes: Hole[];
};

export class TemplateFragment {
  private htmlString = "";

  constructor(strings: TemplateStringsArray) {
    this.htmlString = parse(strings);
  }

  private makeFragment(): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = this.htmlString;
    return template.content;
  }

  public mount(container: ElementWithCache): void {
    const { fragment, holes } = hydrateFragment(this.makeFragment());
    container.appendChild(fragment);
    container.$cache?.renderState.set(this, holes);
  }

  public update(container: ElementWithCache, values: unknown[]): void {
    const holes = container.$cache?.renderState.get(this);
    if (!holes) return;

    const len = holes.length;
    for (let i = 0; i < len; i++) {
      holes[i].setValue(values[i]);
    }
  }
}
