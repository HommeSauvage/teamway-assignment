import { createRequestHandler } from 'lib/server'
import create from 'api-functions/questionnaires/create'

const handler = createRequestHandler({
  POST: {
    authenticate: false,
    handler: create
  }
})

export default handler
