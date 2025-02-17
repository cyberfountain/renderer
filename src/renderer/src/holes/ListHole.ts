import type { Hole } from "./Hole";
import { renderList } from "../render";
import type { HtmlTemplate } from "../HtmlTemplate";

export class ListHole implements Hole {
  constructor(public commentNode: Comment) {}

  public setValue(value: HtmlTemplate[]): void {
    if (Array.isArray(value)) {
      renderList(value, this.commentNode.parentNode);
      return;
    }
  }
}
