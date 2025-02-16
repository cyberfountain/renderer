import type { HtmlTemplate } from "./HtmlTemplate";
import type { TemplateFragment } from "./TemplateFragment";

export type RenderCache = {
  template: Map<TemplateStringsArray, TemplateFragment>;
  listDOM: Map<string, TemplateFragment>;
  listHtmlTemplate: HtmlTemplate[];
};

export type ElementWithCache = {
  $cache: RenderCache;
} & HTMLElement;

export const getCache = (el: HTMLElement | ParentNode): RenderCache => {
  const elc = el as ElementWithCache;
  if (elc.$cache) return elc.$cache;

  elc.$cache = {
    template: new Map<TemplateStringsArray, TemplateFragment>(),
    listDOM: new Map<string, TemplateFragment>(),
    listHtmlTemplate: [],
  };

  return elc.$cache;
};
