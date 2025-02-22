import type { TemplateFragment } from "../TemplateFragment";

type RootNodeRenderCache = {
  template: Map<TemplateStringsArray, TemplateFragment>;
};

type RootNodeWithCache = {
  $cache: RootNodeRenderCache;
} & HTMLElement;

export const getRootCache = (root: HTMLElement): RootNodeRenderCache => {
  const elc = root as RootNodeWithCache;
  if (elc.$cache) return elc.$cache;

  elc.$cache = {
    template: new Map<TemplateStringsArray, TemplateFragment>(),
  };

  return elc.$cache;
};
