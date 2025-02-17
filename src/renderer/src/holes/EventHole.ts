import type { AttributeDefinition } from "../attributes";
import type { AttributeHole } from "./AttributeHole";

export class EventHole implements AttributeHole {
  constructor(
    public node: HTMLElement,
    public definition: AttributeDefinition,
  ) {}

  // Add @click.stop and @click.prevent
  // not sure how doable this is in here :thinking:
  public setValue(value: unknown): void {
    const name = this.definition.name.slice(1);
    (this.node as any)[`on${name}`] = value;
  }
}
