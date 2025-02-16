import type { Hole } from "./Hole";
import { renderList, renderListElement } from "../render";
import type { HtmlTemplate } from "../HtmlTemplate";

export class TemplateHole implements Hole {
  public node = document.createTextNode("");

  public setValue(value: HtmlTemplate[]): void {
    if (Array.isArray(value)) {
      renderList(value, this.node.parentNode);
      const len = value.length;
      for (let i = 0; i < len; i++) {
        renderListElement(value[i], this.node.parentNode);
      }
      return;
    }

    // eslint-disable-next-line no-null/no-null
    const stringValue = value != null ? String(value) : "";

    if (this.node.textContent !== stringValue) {
      this.node.textContent = stringValue;
    }
  }
}
