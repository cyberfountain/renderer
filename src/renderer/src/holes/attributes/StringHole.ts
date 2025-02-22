import type { AttributeDefinition } from "../../attributes";
import type { AttributeHole } from "./AttributeHole";

export class StringHole implements AttributeHole {
  constructor(
    public node: HTMLElement,
    public definition: AttributeDefinition,
  ) {}

  public setValue(value: unknown): void {
    this.node.setAttribute(this.definition.name, String(value));
  }
}
