import { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";
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
    templateFragment.mountList(container, template.key, template.values);
  }
  templateFragment.update(template.values);
};

// if cache array empty skip diffing - initial render
// if new array empty skip diffing
// if inserts are === to the length of new array just tear it down
// maybe a high end percentage let's 90% change and long list just tear it down and rerender ??
// what thosecriteria whould be waht is a long list 1k 2k 10k :shrug:
// same with deletes
// inserts possibly just renderListItem append at given point instead of appending child
// render array cache just replace every time
//
// initial render loop over all
// diff sequence ?? :
//  1. deletes
//  2. moves
//  3. inserts
//
//  operate on listCache for deletes and moves
//  when deleting remove from cache
//  itterate over cache and trigger update
//  perform insert - renderListItem before a given child instead of container append :thinking:
//  I think I want the whole rendering procudure to happen here not in TemplateHole :thinking:
//
//  This has to be written modular so I can unit test this, this is critical part

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

export const renderList = (
  values: HtmlTemplate[],
  container: ParentNode | null,
): void => {
  const cache = getCache(container);
  if (!cache || !container) return;

  // Initial Render
  if (!cache.listHtmlTemplate.length) {
    renderAllItems(values, container);
  }

  // Empty Incoming List
  if (!values.length) {
    const frag = document.createDocumentFragment();
    const comment = getFirstComment(container);
    frag.appendChild(comment);
    (container as HTMLElement).innerHTML = "";
    container.appendChild(frag.firstChild as Comment);
    cache.listTemplate.clear();
  }

  cache.listHtmlTemplate = values;
};
