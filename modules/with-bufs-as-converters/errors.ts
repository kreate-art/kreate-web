export class CodecError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super("CodecError: " + message, options);
  }

  static assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
      throw new CodecError(message || "assertion failed");
    }
  }
}
