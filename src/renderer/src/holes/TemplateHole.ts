import type { Hole } from "./Hole";
import { renderList } from "../render";

export class TemplateHole implements Hole {
  public node: Text;

  constructor() {
    this.node = document.createTextNode("");
  }

  public setValue(value: unknown): void {
    if (Array.isArray(value)) {
      const len = value.length;
      for (let i = 0; i < len; i++) {
        renderList(value[i], this.node.parentNode, i);
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
