import '@testing-library/jest-dom/extend-expect'
import fetch, { Headers, Request, Response } from 'node-fetch'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}