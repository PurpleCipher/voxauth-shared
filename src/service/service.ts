export interface Service {
  parse: <T>(req: Request, key: "body" | "params" | "query" | "headers") => T;
  /**
   * Respond to the request.
   * @param {e.Response} res
   * @param {number} status
   * @param {T} payload
   */
  respond: <T>(res: Response, status?: number, payload?: T) => void;
}
