import { HtmlTemplate } from "../HtmlTemplate";
import type { Hole } from "./Hole";
import { ListHole } from "./ListHole";
import { StringHole } from "./StringHole";
import { TemplateHole } from "./TemplateHole";

export class HoleFactory {
  public static create(valueAtIndex: unknown, node: Comment): Hole {
    if (Array.isArray(valueAtIndex)) {
      return new ListHole(node);
    }

    if (valueAtIndex instanceof HtmlTemplate) {
      return new TemplateHole(node);
    }

    return new StringHole(node);
  }
}
