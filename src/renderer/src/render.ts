import { HtmlTemplate } from "./HtmlTemplate";
import { TemplateFragment } from "./TemplateFragment";
import { getRootCache } from "./cache/cache";

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

  const cache = getRootCache(container);
  let templateFragment = cache.template.get(template.strings);

  if (!templateFragment) {
    templateFragment = new TemplateFragment(template);
    cache.template.set(template.strings, templateFragment);
    templateFragment.mount(container, template.values);
  }

  templateFragment.update(template.values);
};
