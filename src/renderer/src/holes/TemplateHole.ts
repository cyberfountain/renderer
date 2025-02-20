import type { Hole } from "./Hole";
import type { HtmlTemplate } from "../HtmlTemplate";
import { TemplateRenderer } from "../render/TemplateRenderer";

export class TemplateHole implements Hole {
  private renderer: TemplateRenderer;

  constructor(public commentNode: Comment) {
    this.renderer = new TemplateRenderer(commentNode);
  }

  public setValue(value: HtmlTemplate): void {
    this.renderer.render(value);
  }
}
