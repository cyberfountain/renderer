import type { Hole } from "./Hole";
import type { HtmlTemplate } from "../HtmlTemplate";
import { ListRenderer } from "../render/ListRenderer";
import { getCache } from "../element";

export class ListHole implements Hole {
  private renderer: ListRenderer;

  constructor(public commentNode: Comment) {
    const parentNode = this.commentNode.parentNode;

    if (!parentNode) {
      throw new Error("ListRenderer needs to accept instance of ParentNode");
    }

    const cache = getCache(parentNode);
    if (!cache) {
      throw new Error("ListRenderer needs to accept instance of ParentNode");
    }

    this.renderer = new ListRenderer(parentNode, cache);
  }

  public setValue(values: HtmlTemplate[]): void {
    this.renderer.render(values);
  }
}
