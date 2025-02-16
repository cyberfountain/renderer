export class HtmlTemplate {
  public key?: string = undefined;

  constructor(
    public strings: TemplateStringsArray,
    public values: unknown[],
  ) {}
}
