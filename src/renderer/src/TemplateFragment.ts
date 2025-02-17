import { getCache } from "./element";
import type { Hole } from "./holes/Hole";
import type { HtmlTemplate } from "./HtmlTemplate";
import { TemplateHole } from "./holes/TemplateHole";
import { TEMPLATE_MARKER_GLYPH } from "./constants";
import { getIndexFromComment, makeMarkerComment } from "./utils";
import {
  type AttributeDefinition,
  detectAttributes,
  processAttribute,
} from "./attributes";

export class TemplateFragment {
  private htmlString = "";
  public holes = new Map<number, Hole>();
  private attributeMap: AttributeDefinition[] = [];

  constructor(template: HtmlTemplate) {
    this.parse(template.strings);
  }

  private parse(strings: TemplateStringsArray): void {
    const len = strings.length;
    for (let i = 0; i < len; i++) {
      this.htmlString += strings[i];
      if (i < strings.length - 1) {
        const attr = detectAttributes(this.htmlString, i);
        if (attr) this.attributeMap.push(attr);
        this.htmlString += makeMarkerComment(i);
      }
    }
  }

  private initFragment(): DocumentFragment {
    const template = document.createElement("template");
    template.innerHTML = this.htmlString;
    return template.content;
  }

  private hydrateAttributes(fragment: DocumentFragment): DocumentFragment {
    const len = this.attributeMap.length;
    for (let i = 0; i < len; i++) {
      const hole = processAttribute(fragment, this.attributeMap[i]);
      if (hole) this.holes.set(this.attributeMap[i].index, hole);
    }

    return fragment;
  }

  private hydrateTemplateHoles(fragment: DocumentFragment): DocumentFragment {
    const walker = document.createTreeWalker(
      fragment,
      NodeFilter.SHOW_COMMENT,
      // eslint-disable-next-line no-null/no-null
      null,
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;

      if (node.nodeValue?.includes(TEMPLATE_MARKER_GLYPH)) {
        const holeIndex = getIndexFromComment(node.nodeValue);
        const expressionMarker = new TemplateHole();
        node.parentNode?.insertBefore(expressionMarker.node, node);
        this.holes.set(holeIndex, expressionMarker);
      }
    }

    return fragment;
  }

  public mount(container: HTMLElement | ParentNode): void {
    const fragment = this.initFragment();
    this.hydrateTemplateHoles(fragment);
    this.hydrateAttributes(fragment);
    container.appendChild(fragment);
  }

  public mountList(container: HTMLElement | ParentNode, itemKey: string): void {
    this.mount(container);
    const cache = getCache(container);
    if (container.lastChild && cache) {
      cache.listNodes.set(itemKey, container.lastChild);
    }
  }

  public update(values: unknown[]): void {
    for (const [index, hole] of this.holes) {
      hole.setValue(values[index]);
    }
  }
}
