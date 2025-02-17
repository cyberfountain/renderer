export abstract class Hole {
  public abstract commentNode: Comment;

  public abstract setValue(value: unknown): void;
}
