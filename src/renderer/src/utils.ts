import { TEMPLATE_MARKER_GLYPH, VOID_ELEMENTS } from "./constants";

export const getIndexFromComment = (comment: string): number => {
  const regex = new RegExp(`${TEMPLATE_MARKER_GLYPH}(\\d+)`);
  const match = comment.match(regex);
  if (!match) {
    throw new Error("Unable to extract index from hole comment");
  }
  return Number(match[1]);
};

export const makeMarkerComment = (index: number): string => {
  return `<!--${TEMPLATE_MARKER_GLYPH}${index}-->`;
};

export const fastUID = (): string =>
  Math.floor(performance.now() * 1000).toString(36) +
  Math.random().toString(36).slice(2, 6);

export const fixSelfClosingTags = (input: string): string => {
  return input.replace(
    /<([a-zA-Z][^\s/>]*)([^>]*)\/>/g,
    (match: string, tagName: string, rest: string) => {
      if (VOID_ELEMENTS.test(tagName)) {
        return match;
      }
      return `<${tagName}${rest}></${tagName}>`;
    },
  );
};
