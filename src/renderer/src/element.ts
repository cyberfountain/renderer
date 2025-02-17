import type { HtmlTemplate } from "./HtmlTemplate";
import type { TemplateFragment } from "./TemplateFragment";

export type RenderCache = {
  template: Map<TemplateStringsArray, TemplateFragment>;
  listTemplate: Map<string, TemplateFragment>;
  listNodes: Map<string, ChildNode>;
  listHtmlTemplate: HtmlTemplate[];
};

export type ElementWithCache = {
  $cache: RenderCache;
} & HTMLElement;

export const getCache = (
  el: HTMLElement | ParentNode | null,
): RenderCache | undefined => {
  if (!el) return undefined;
  const elc = el as ElementWithCache;
  if (elc.$cache) return elc.$cache;

  elc.$cache = {
    template: new Map<TemplateStringsArray, TemplateFragment>(),
    listTemplate: new Map<string, TemplateFragment>(),
    listNodes: new Map<string, ChildNode>(),
    listHtmlTemplate: [],
  };

  return elc.$cache;
};
