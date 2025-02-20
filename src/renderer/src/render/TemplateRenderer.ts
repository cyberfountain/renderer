import type { HtmlTemplate } from "../HtmlTemplate";
import { TemplateFragment } from "../TemplateFragment";

type TemplateCache = {
  strings?: TemplateStringsArray;
  fragment?: TemplateFragment;
  nodes: ChildNode[];
};

export class TemplateRenderer {
  private cache: TemplateCache = { nodes: [] };

  constructor(private commentNode: Comment) {}

  private removeNodes(): void {
    if (!this.cache.nodes.length) return;
    const len = this.cache.nodes.length;
    for (let i = 0; i < len; i++) {
      this.cache.nodes[i].remove();
    }
    this.cache.nodes = [];
  }

  public render(value: HtmlTemplate): void {
    if (this.cache.strings !== value.strings) {
      this.cache.fragment = undefined;
      this.removeNodes();
    }

    if (!this.cache.fragment) {
      this.cache.fragment = new TemplateFragment(value);
      this.cache.strings = value.strings;
      this.cache.nodes = this.cache.fragment.mountTemplate(
        this.commentNode,
        value.values,
      );
    }

    this.cache.fragment.update(value.values);
  }
}
