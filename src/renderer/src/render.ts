import { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";
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
): void => {
  if (!container) {
    throw new Error(
      "renderList method needs to accept instance of HTMLElement",
    );
  }

  if (!template.key) {
    throw new Error("use repeat directive when rendering the lists");
  }
  const cache = getCache(container);
  if (!cache) return;

  let templateFragment = cache?.listTemplate.get(template.key);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template);
    cache.listTemplate.set(template.key, templateFragment);
    templateFragment.mountListElement(container, template.key, template.values);
  }

  templateFragment.update(template.values);
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
    renderListElement(values[i], container);
  }
};

const emptyList = (container: ParentNode, cache: RenderCache): void => {
  const frag = document.createDocumentFragment();
  const comment = getFirstComment(container);
  frag.appendChild(comment);
  (container as HTMLElement).innerHTML = "";
  container.appendChild(frag.firstChild as Comment);
  cache.listTemplate.clear();
};

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

  const { deletes, inserts } = diff(cache.listHtmlTemplate, values);

  if (deletes.length === values.length || inserts.length === values.length) {
    emptyList(container, cache);
    renderAllItems(values, container);

    cache.listHtmlTemplate = values;
    return;
  }

  // deal with deletes, deal with moves
  // keep cache.listTemplate in sync when deleting
  // iterate over cache.listTemplate and call an TemplateFragment.update()
  // deal with inserts:
  // - inserts have to be performed from back to front!!
  // - if beforeKey is undefined means last element just append
  // - pass before node to renderListElement to append in correct place
  // Done! :tada:

  cache.listHtmlTemplate = values;
};
