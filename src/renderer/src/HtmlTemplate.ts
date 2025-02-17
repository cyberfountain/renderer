export class HtmlTemplate {
  public key = "";

  constructor(
    public strings: TemplateStringsArray,
    public values: unknown[],
  ) {}
}
