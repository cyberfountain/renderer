import type { Hole } from "./holes/Hole";
import type { TemplateFragment } from "./TemplateFragment";

export type ElementWithCache = {
  $cache?: {
    template: Map<TemplateStringsArray, TemplateFragment>;
    list: Map<number, TemplateFragment>;
    renderState: Map<TemplateFragment, Hole[]>;
  };
} & HTMLElement;

export const initCache = (el: ElementWithCache): void => {
  if (el.$cache) return;

  el.$cache = {
    template: new Map<TemplateStringsArray, TemplateFragment>(),
    list: new Map<number, TemplateFragment>(),
    renderState: new Map<TemplateFragment, Hole[]>(),
  };
};
