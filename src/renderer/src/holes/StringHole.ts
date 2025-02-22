import type { Hole } from "./Hole";
import type { HtmlTemplate } from "../HtmlTemplate";

export class StringHole implements Hole {
  public node = document.createTextNode("");

  constructor(public commentNode: Comment) {
    commentNode.before(this.node);
  }

  public setValue(value: HtmlTemplate[]): void {
    // eslint-disable-next-line no-null/no-null
    const stringValue = value != null ? String(value) : "";

    if (this.node.textContent !== stringValue) {
      this.node.textContent = stringValue;
    }
  }
}
