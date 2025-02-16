import type { ElementWithCache } from "./element";
import { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";
import { initCache, initListCache } from "./element";

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

  const cnt = container as ElementWithCache;
  initCache(cnt);
  let templateFragment = cnt.$cache?.template.get(template.strings);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template.strings);
    cnt.$cache!.template.set(template.strings, templateFragment);
    templateFragment.mount(cnt);
  }

  templateFragment.update(template.values);
};

// TODO: two func almost the same keep it for now
export const renderList = (
  template: HtmlTemplate,
  container: ParentNode | null,
  index: number, //temporary or not ??
): void => {
  if (!container) {
    throw new Error(
      "renderList method needs to accept instance of HTMLElement",
    );
  }

  const cnt = container as ElementWithCache;
  initCache(cnt);
  let templateFragment = cnt.$cache?.list.get(index);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template.strings);
    cnt.$cache!.list.set(index, templateFragment);
    templateFragment.mount(cnt);
  }

  templateFragment.update(template.values);
};
