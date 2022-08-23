import { createRequestHandler } from 'lib/servet'
import create from 'api-functions/questionnaires/create'

const handler = createRequestHandler({
  POST: {
    authenticate: false,
    handler: create
  }
})

export default handler
