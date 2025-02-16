import type { HtmlTemplate } from "./HtmlTemplate";

export const repeat = <T = unknown>(
  list: T[],
  callback: (val: T, index: number) => HtmlTemplate,
  key: ((val: T) => string) | undefined,
): HtmlTemplate[] => {
  const result = [];
  const len = list.length;
  for (let i = 0; i < len; i++) {
    const template = callback(list[i], i);
    if (key) template.key = key(list[i]);
    result.push(template);
  }
  return result;
};
