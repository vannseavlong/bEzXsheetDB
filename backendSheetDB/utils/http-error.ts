/** Thrown for expected 4xx failures inside route handlers; caught locally and turned into a
 *  response instead of falling through to the generic 500 errorHandler. */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}
