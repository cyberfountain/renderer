import { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";
import type {
  DiffDeleteOperations,
  DiffInsertOperations,
  DiffMoveOperations,
} from "./diff";
import { diff } from "./diff";
import type { RenderCache } from "./element";
import { getCache } from "./element";

export const html = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): HtmlTemplate => {
  return new HtmlTemplate(strings, values);
};

export const render = (
  template: HtmlTemplate,
  container: HTMLElement | null,
): void => {
  if (!container) {
    throw new Error("render method needs to accept instance of HTMLElement");
  }

  const cache = getCache(container);
  if (!cache) return;
  let templateFragment = cache.template.get(template.strings);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template);
    cache.template.set(template.strings, templateFragment);
    templateFragment.mount(container, template.values);
  }

  templateFragment.update(template.values);
};

export const renderListElement = (
  template: HtmlTemplate,
  container: ParentNode | null,
  beforeNode?: Node,
): TemplateFragment | undefined => {
  if (!container) {
    throw new Error(
      "renderList method needs to accept instance of HTMLElement",
    );
  }

  if (!template.key) {
    throw new Error("use repeat directive when rendering the lists");
  }
  const cache = getCache(container);
  if (!cache) return undefined;

  let templateFragment = cache?.listTemplate.get(template.key);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template);
    cache.listTemplate.set(template.key, templateFragment);
    templateFragment.mountListElement(
      container,
      template.key,
      template.values,
      beforeNode,
    );
  }

  return templateFragment;
};

const getFirstComment = (ctn: ParentNode): Comment => {
  // Browser weirdness white space is treated as Text node when parsed from innerHtml
  // got to check first and second node :shrug:
  if (ctn.childNodes[0] instanceof Comment) return ctn.childNodes[0] as Comment;
  return ctn.childNodes[1] as Comment;
};

const renderAllItems = (
  values: HtmlTemplate[],
  container: ParentNode,
): void => {
  const len = values.length;
  for (let i = 0; i < len; i++) {
    const fragment = renderListElement(values[i], container);
    if (fragment) fragment.update(values[i].values);
  }
};

const updateAllItems = (values: HtmlTemplate[], cache: RenderCache): void => {
  const len = values.length;
  for (let i = 0; i < len; i++) {
    const templateFragment = cache.listTemplate.get(values[i].key);
    templateFragment?.update(values[i].values);
  }
};

const emptyList = (container: ParentNode, cache: RenderCache): void => {
  const frag = document.createDocumentFragment();
  const comment = getFirstComment(container);
  frag.appendChild(comment);
  (container as HTMLElement).innerHTML = "";
  container.appendChild(frag.firstChild as Comment);
  cache.listTemplate.clear();
  cache.listNodes.clear();
  cache.template.clear();
};

const deleteNodes = (
  deletes: DiffDeleteOperations,
  cache: RenderCache,
): void => {
  const len = deletes.length;
  for (let i = 0; i < len; i++) {
    const node = cache.listNodes.get(deletes[i].key);
    if (node) node.remove();
    cache.listNodes.delete(deletes[i].key);
    cache.listTemplate.delete(deletes[i].key);
  }
};

const moveNodes = (
  moves: DiffMoveOperations,
  cache: RenderCache,
  container: ParentNode,
): void => {
  const len = moves.length;
  for (let i = 0; i < len; i++) {
    const node = cache.listNodes.get(moves[i].key);
    const beforeNode = cache.listNodes.get(moves[i].beforeKey!);

    if (node && beforeNode) container.insertBefore(node, beforeNode);
    if (!beforeNode && node) container.appendChild(node);
  }
};

const insertNodes = (
  inserts: DiffInsertOperations,
  cache: RenderCache,
  container: ParentNode,
): void => {
  const len = inserts.length;
  for (let i = len - 1; i >= 0; i--) {
    const node = cache.listNodes.get(inserts[i].beforeKey!);
    renderListElement(inserts[i].value, container, node);
  }
};

// This is starting to form a nice class with emerging context :heart:
// almost looks like a command pattern :thinking:
export const renderList = (
  values: HtmlTemplate[],
  container: ParentNode | null,
): void => {
  const cache = getCache(container);
  if (!cache || !container) return;

  // Initial Render
  if (!cache.listHtmlTemplate.length) {
    renderAllItems(values, container);

    cache.listHtmlTemplate = values;
    return;
  }

  // Empty Incoming List
  if (!values.length) {
    emptyList(container, cache);

    cache.listHtmlTemplate = values;
    return;
  }

  const { deletes, inserts, moves } = diff(cache.listHtmlTemplate, values);

  if (deletes.length === values.length || inserts.length === values.length) {
    emptyList(container, cache);
    renderAllItems(values, container);

    cache.listHtmlTemplate = values;
    return;
  }

  if (deletes.length) {
    deleteNodes(deletes, cache);
  }

  if (moves.length) {
    moveNodes(moves, cache, container);
  }

  if (inserts.length) {
    insertNodes(inserts, cache, container);
  }

  updateAllItems(values, cache);

  cache.listHtmlTemplate = values;
};
