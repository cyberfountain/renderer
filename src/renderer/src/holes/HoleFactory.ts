import type { Hole } from "./Hole";
import { ListHole } from "./ListHole";
import { TemplateHole } from "./TemplateHole";

export class HoleFactory {
  public static create(valueAtIndex: unknown, node: Comment): Hole {
    if (Array.isArray(valueAtIndex)) {
      return new ListHole(node);
    }

    return new TemplateHole(node);
  }
}
