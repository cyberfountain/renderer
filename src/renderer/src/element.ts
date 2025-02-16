import type { HtmlTemplate } from "./HtmlTemplate";
import type { TemplateFragment } from "./TemplateFragment";

export type ElementWithCache = {
  $cache?: {
    template: Map<TemplateStringsArray, TemplateFragment>;
    listDOM: Map<string, TemplateFragment>;
    listHtmlTemplate: HtmlTemplate[];
  };
} & HTMLElement;

export const initCache = (el: ElementWithCache): void => {
  if (el.$cache) return;

  el.$cache = {
    template: new Map<TemplateStringsArray, TemplateFragment>(),
    listDOM: new Map<string, TemplateFragment>(),
    listHtmlTemplate: [],
  };
};
