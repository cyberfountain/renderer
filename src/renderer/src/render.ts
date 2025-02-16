import type { ElementWithCache } from "./element";
import { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";
import { initCache } from "./element";

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
    templateFragment = new TemplateFragment(template);
    cnt.$cache!.template.set(template.strings, templateFragment);
    templateFragment.mount(cnt);
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

  const cnt = container as ElementWithCache;
  initCache(cnt);
  let templateFragment = cnt.$cache?.listDOM.get(template.key);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template);
    cnt.$cache!.listDOM.set(template.key, templateFragment);
    templateFragment.mount(cnt);
  }

  templateFragment.update(template.values);
};
