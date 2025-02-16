import type { AttributeDefinition } from "../attributes";
import type { Hole } from "./Hole";

export class EventHole implements Hole {
  constructor(
    public node: HTMLElement,
    private definition: AttributeDefinition,
  ) {}

  // Add @click.stop and @click.prevent
  // not sure how doable this is in here :thinking:
  public setValue(value: unknown): void {
    const name = this.definition.name.slice(1);
    (this.node as any)[`on${name}`] = value;
  }
}
