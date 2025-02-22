import type { AttributeDefinition } from "../../attributes";
import type { AttributeHole } from "./AttributeHole";

type Component = {
  $props: {
    set: (name: string, value: unknown) => void;
  };
} & HTMLElement;

export class PropHole implements AttributeHole {
  constructor(
    public node: HTMLElement,
    public definition: AttributeDefinition,
  ) {}

  public setValue(value: unknown): void {
    const name = this.definition.name.slice(1);
    const node = this.node as Component;
    if (node.$props) node.$props.set(name, value);
  }
}
