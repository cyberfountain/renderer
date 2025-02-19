import type {
  DiffDeleteOperations,
  DiffInsertOperations,
  DiffMoveOperations,
} from "./diff";
import { diff } from "./diff";
import { type RenderCache } from "./element";
import type { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";

export class ListRenderer {
  constructor(
    private container: ParentNode,
    private cache: RenderCache,
  ) {}

  private renderListElement(
    template: HtmlTemplate,
    beforeNode?: Node,
  ): TemplateFragment {
    if (!this.container) {
      throw new Error(
        "renderList method needs to accept instance of HTMLElement",
      );
    }

    if (!template.key) {
      throw new Error("use repeat directive when rendering the lists");
    }

    let templateFragment = this.cache.listTemplate.get(template.key);

    if (!templateFragment) {
      templateFragment = new TemplateFragment(template);
      this.cache.listTemplate.set(template.key, templateFragment);
      templateFragment.mountListElement(
        this.container,
        template.key,
        template.values,
        beforeNode,
      );
    }

    return templateFragment;
  }

  private renderAllItems(values: HtmlTemplate[]): void {
    const len = values.length;
    for (let i = 0; i < len; i++) {
      const fragment = this.renderListElement(values[i]);
      fragment.update(values[i].values);
    }
  }

  private getFirstComment(): Comment {
    // Browser weirdness white space is treated as Text node when parsed from innerHtml
    // got to check first and second node :shrug:
    if (this.container.childNodes[0] instanceof Comment) {
      return this.container.childNodes[0] as Comment;
    }
    return this.container.childNodes[1] as Comment;
  }

  private emptyList(): void {
    const frag = document.createDocumentFragment();
    const comment = this.getFirstComment();
    frag.appendChild(comment);
    (this.container as HTMLElement).innerHTML = "";
    this.container.appendChild(frag.firstChild as Comment);
    this.cache.listTemplate.clear();
    this.cache.listNodes.clear();
    this.cache.template.clear();
  }

  private deleteNodes(deletes: DiffDeleteOperations): void {
    const len = deletes.length;
    for (let i = len - 1; i >= 0; i--) {
      const node = this.cache.listNodes.get(deletes[i].key);
      if (node) node.remove();
      this.cache.listNodes.delete(deletes[i].key);
      this.cache.listTemplate.delete(deletes[i].key);
    }
  }

  private moveNodes(moves: DiffMoveOperations): void {
    const len = moves.length;
    for (let i = len - 1; i >= 0; i--) {
      const node = this.cache.listNodes.get(moves[i].key);
      const beforeNode = this.cache.listNodes.get(moves[i].beforeKey!);

      if (node && beforeNode) this.container.insertBefore(node, beforeNode);
      if (!beforeNode && node) this.container.appendChild(node);
    }
  }

  private insertNodes(inserts: DiffInsertOperations): void {
    const len = inserts.length;
    for (let i = len - 1; i >= 0; i--) {
      const node = this.cache.listNodes.get(inserts[i].beforeKey!);
      this.renderListElement(inserts[i].value, node);
    }
  }

  private updateAllItems(values: HtmlTemplate[]): void {
    const len = values.length;
    for (let i = 0; i < len; i++) {
      const templateFragment = this.cache.listTemplate.get(values[i].key);
      templateFragment?.update(values[i].values);
    }
  }

  public render(values: HtmlTemplate[]): void {
    // Initial Render
    if (!this.cache.listHtmlTemplate.length) {
      this.renderAllItems(values);

      this.cache.listHtmlTemplate = values;
      return;
    }

    // Empty Incoming List
    if (!values.length) {
      this.emptyList();

      this.cache.listHtmlTemplate = values;
      return;
    }

    const { deletes, inserts, moves } = diff(
      this.cache.listHtmlTemplate,
      values,
    );

    if (deletes.length === values.length || inserts.length === values.length) {
      this.emptyList();
      this.renderAllItems(values);

      this.cache.listHtmlTemplate = values;
      return;
    }

    if (deletes.length) {
      this.deleteNodes(deletes);
    }

    if (moves.length) {
      this.moveNodes(moves);
    }

    if (inserts.length) {
      this.insertNodes(inserts);
    }

    this.updateAllItems(values);
    this.cache.listHtmlTemplate = values;
  }
}
