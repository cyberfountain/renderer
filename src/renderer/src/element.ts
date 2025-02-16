import type { TemplateFragment } from "./TemplateFragment";

export type ElementWithCache = {
  $cache?: {
    template: Map<TemplateStringsArray, TemplateFragment>;
    list: Map<number, TemplateFragment>;
  };
} & HTMLElement;

export const initCache = (el: ElementWithCache): void => {
  if (el.$cache) return;

  el.$cache = {
    template: new Map<TemplateStringsArray, TemplateFragment>(),
    list: new Map<number, TemplateFragment>(),
  };
};
