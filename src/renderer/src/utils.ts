import { TEMPLATE_MARKER_GLYPH } from "./constants";

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
