import type {
  DiffDeleteOperations,
  DiffInsertOperations,
  DiffMoveOperations,
} from "../diff";
import { diff } from "../diff";
import type { HtmlTemplate } from "../HtmlTemplate";
import { TemplateFragment } from "../TemplateFragment";

export type RenderCache = {
  listTemplate: Map<string, TemplateFragment>;
  listNodes: Map<string, ChildNode>;
  listHtmlTemplate: HtmlTemplate[];
};

export class ListRenderer {
  private cache: RenderCache = {
    listTemplate: new Map<string, TemplateFragment>(),
    listNodes: new Map<string, ChildNode>(),
    listHtmlTemplate: [],
  };

  constructor(private commentNode: Comment) {}

  private renderListElement(
    template: HtmlTemplate,
    beforeNode?: ChildNode,
  ): TemplateFragment {
    if (!this.commentNode) {
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
        this.commentNode,
        template.key,
        template.values,
        this.cache,
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

  private emptyList(): void {
    for (const [, node] of this.cache.listNodes) {
      node.remove();
    }
    this.cache.listTemplate.clear();
    this.cache.listNodes.clear();
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

      if (node && beforeNode) beforeNode?.before(node);
      if (!beforeNode && node) this.commentNode.before(node);
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
