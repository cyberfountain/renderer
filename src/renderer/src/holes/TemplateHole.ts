import type { Hole } from "./Hole";
import { renderList, renderListElement } from "../render";
import type { HtmlTemplate } from "../HtmlTemplate";

export class TemplateHole implements Hole {
  public node = document.createTextNode("");

  // TODO: New hole for array rendering
  public setValue(value: HtmlTemplate[]): void {
    if (Array.isArray(value)) {
      renderList(value, this.node.parentNode);
      return;
    }

    // eslint-disable-next-line no-null/no-null
    const stringValue = value != null ? String(value) : "";

    if (this.node.textContent !== stringValue) {
      this.node.textContent = stringValue;
    }
  }
}
