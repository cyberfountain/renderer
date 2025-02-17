import type { AttributeDefinition } from "../attributes";

export abstract class AttributeHole {
  public abstract node: HTMLElement;
  public abstract definition: AttributeDefinition;

  public abstract setValue(value: unknown): void;
}
