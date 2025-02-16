import type { Hole } from "./Hole";
import { renderListElement } from "../render";
import type { HtmlTemplate } from "../HtmlTemplate";
import type { ElementWithCache } from "../element";

export class TemplateHole implements Hole {
  public node = document.createTextNode("");

  public setValue(value: HtmlTemplate[]): void {
    if (Array.isArray(value)) {
      const parent = this.node.parentNode as ElementWithCache;
      const len = value.length;
      for (let i = 0; i < len; i++) {
        renderListElement(value[i], parent);
      }
      if (parent) parent.$cache!.listHtmlTemplate = value;
      return;
    }

    // eslint-disable-next-line no-null/no-null
    const stringValue = value != null ? String(value) : "";

    if (this.node.textContent !== stringValue) {
      this.node.textContent = stringValue;
    }
  }
}
