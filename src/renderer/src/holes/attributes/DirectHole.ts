import type { AttributeDefinition } from "../../attributes";
import type { AttributeHole } from "./AttributeHole";

export class DirectHole implements AttributeHole {
  constructor(
    public node: HTMLElement,
    public definition: AttributeDefinition,
  ) {}

  public setValue(value: unknown): void {
    const name = this.definition.name.slice(1);
    (this.node as any)[name] = value;
  }
}
