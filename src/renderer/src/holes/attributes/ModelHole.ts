import type { AttributeDefinition } from "../../attributes";
import type { AttributeHole } from "./AttributeHole";

export class ModelHole implements AttributeHole {
  constructor(
    public node: HTMLElement,
    public definition: AttributeDefinition,
  ) {}

  public setValue(value: { value: string }): void {
    const handler = (e: Event): void => {
      value.value = (e.target as HTMLInputElement).value;
    };

    if (!this.node.oninput) {
      (this.node as HTMLInputElement).value = value.value;
      this.node.oninput = handler;
    }
  }
}
