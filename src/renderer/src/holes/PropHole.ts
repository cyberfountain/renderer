import type { AttributeDefinition } from "../attributes";
import type { Hole } from "./Hole";

export class PropHole implements Hole {
  constructor(
    public node: HTMLElement,
    private definition: AttributeDefinition,
  ) {}

  public setValue(value: unknown): void {
    console.error("Not Implemented!", value, this.definition);
  }
}
