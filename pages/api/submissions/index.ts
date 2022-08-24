import { ok } from 'lib/r'
import { createRequestHandler } from 'lib/server'
import create from 'api-functions/submissions/create'

const handler = createRequestHandler({
  GET: {
    authenticate: true,
    handler: () => { 
      return ok({
        hello: 'world'
      })
    }
  },
  POST: {
    authenticate: false,
    handler: create
  }
})

export default handler
