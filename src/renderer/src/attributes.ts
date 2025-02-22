import { Attributes } from "./constants";
import type { AttributeHole } from "./holes/attributes/AttributeHole";
import { DirectHole } from "./holes/attributes/DirectHole";
import { EventHole } from "./holes/attributes/EventHole";
import { ModelHole } from "./holes/attributes/ModelHole";
import { PropHole } from "./holes/attributes/PropHole";
import { StringHole } from "./holes/attributes/StringHole";
import { makeMarkerComment } from "./utils";

export type AttributeDefinition = {
  index: number;
  name: string;
  value: string;
  virtual: boolean;
  type: Attributes;
};

export const detectAttributes = (
  strings: string,
  index: number,
): AttributeDefinition | undefined => {
  const regex = /(\S+)(?==(?:["']?)$)/;
  const match = strings.match(regex);

  if (match) {
    const result = {
      index: index,
      name: match[1],
      value: makeMarkerComment(index),
      virtual: false,
      type: Attributes.STD,
    };

    switch (match[1][0]) {
      case "@":
        result.type = Attributes.EVENT;
        result.virtual = true;
        return result;
      case ":":
        result.type = Attributes.PROP;
        result.virtual = true;
        return result;
      case ".":
        result.type = Attributes.DIRECT;
        result.virtual = true;
        return result;
      case "~":
        if (match[1].startsWith("~model")) {
          result.type = Attributes.MODEL;
          result.virtual = true;
        }
        return result;
      default:
        return result;
    }
  }

  return undefined;
};

export const processAttribute = (
  fragment: DocumentFragment,
  definition: AttributeDefinition,
): AttributeHole | undefined => {
  const node = fragment.querySelector<HTMLElement>(
    selectorPattern(definition.name, definition.value, definition.virtual),
  );

  if (node) {
    if (definition.virtual) {
      node.removeAttribute(definition.name);
    }

    switch (definition.type) {
      case Attributes.EVENT:
        return new EventHole(node, definition);
      case Attributes.PROP:
        return new PropHole(node, definition);
      case Attributes.DIRECT:
        return new DirectHole(node, definition);
      case Attributes.MODEL:
        return new ModelHole(node, definition);
      default:
        return new StringHole(node, definition);
    }
  }

  return undefined;
};

const selectorPattern = (
  name: string,
  value: string,
  isVirtual: boolean,
): string => {
  if (isVirtual) return `[\\${name}='${value}']`;
  return `[${name}='${value}']`;
};
