import type { Hole } from "./Hole";
import type { HtmlTemplate } from "../HtmlTemplate";
import { ListRenderer } from "../render/ListRenderer";

export class ListHole implements Hole {
  private renderer: ListRenderer;

  constructor(public commentNode: Comment) {
    this.renderer = new ListRenderer(commentNode);
  }

  public setValue(values: HtmlTemplate[]): void {
    this.renderer.render(values);
  }
}
