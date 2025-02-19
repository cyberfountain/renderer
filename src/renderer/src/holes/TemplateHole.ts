import type { Hole } from "./Hole";
import type { HtmlTemplate } from "../HtmlTemplate";
import { render } from "../render";

export class TemplateHole implements Hole {
  constructor(public commentNode: Comment) {}

  public setValue(value: HtmlTemplate): void {
    if (!this.commentNode.parentNode) {
      throw new Error(
        "TemplateRenderer needs to accept instance of ParentNode",
      );
    }

    // Add a class TemplateRenderer - I want render function to be only used at very top level
    // Don't think I can do this here
    // May need a separate renderer
    // It all depends on elements having parents so far
    // with in-line elements with no parent I lost the insertion point and node reference
    //
    // Cook two chickens on one fire fix conditional rendering and in-line rendering with no parents
    // 1. Use comment node as insertion point
    // 2. Store reference to rendered node - this will only work with a single node or string :thinking:
    //  - react <></> bullshit
    //  - vue - single root node for template bullshit
    // 3. If not the same node remove previous node and add new one
    // insertBefore in conjunction with .previousSibling will work magic here :tada:
    //  - that would work for a single root node :thinking:
    //
    // Incoming templates are cached by incoming strings :thinking:
    //  - if cached strings are the same just render no matter
    //  - if different swap template
    //
    //  This is a nightmare - maybe not :thinking:
    //
    //  Could I insert additional marker comment?? Then I would have start and end
    //
    //  Potentially store references to all child Nodes and In case of a different template incoming delete old nodes and re render new :tada:
    render(value, this.commentNode.parentNode as HTMLElement);
  }
}
