import { MARKER_GLYPH } from "./constants";
import type { TemplateFragmentResults } from "./TemplateFragment";
import { TemplateHole } from "./holes/TemplateHole";

// TODO: Most likely deal with other things here as @click fe
export const parse = (strings: TemplateStringsArray): string => {
  let html = "";
  const len = strings.length;
  for (let i = 0; i < len; i++) {
    html += strings[i];
    if (i < strings.length - 1) {
      html += `<!--${MARKER_GLYPH}${i}-->`;
    }
  }

  return html;
};

export const hydrateFragment = (
  fragment: DocumentFragment,
): TemplateFragmentResults => {
  const walker = document.createTreeWalker(
    fragment,
    NodeFilter.SHOW_COMMENT,
    // eslint-disable-next-line no-null/no-null
    null,
  );

  const holes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node.nodeValue?.includes(MARKER_GLYPH)) {
      const regex = new RegExp(`${MARKER_GLYPH}(\\d+)`);
      const match = node.nodeValue.match(regex);
      const holeIndex = Number(match?.[1]);
      const expressionMarker = new TemplateHole();
      node.parentNode?.insertBefore(expressionMarker.node, node);
      holes[holeIndex] = expressionMarker;
    }
  }

  return { fragment, holes };
};
