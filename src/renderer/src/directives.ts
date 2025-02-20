import type { HtmlTemplate } from "./HtmlTemplate";
import { fastUID } from "./utils";

export const __key__ = Symbol("__key__");

export const repeat = <T extends Record<string | symbol, unknown>>(
  list: T[],
  callback: (val: T, index: number) => HtmlTemplate,
): HtmlTemplate[] => {
  return list.map((item, index) => {
    if (!item[__key__]) (item[__key__] as any) = fastUID();
    const template = callback(item, index);
    template.key = item[__key__] as string;
    return template;
  });
};

export const condition = (
  condition: boolean | (() => boolean),
  trueTemplate: HtmlTemplate,
  falseTemplate: HtmlTemplate,
): HtmlTemplate => {
  const result = typeof condition === "function" ? condition() : condition;
  return result ? trueTemplate : falseTemplate;
};
