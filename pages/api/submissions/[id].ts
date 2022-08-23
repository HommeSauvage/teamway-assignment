import { createRequestHandler } from 'lib/servet'
import show from 'api-functions/submissions/show'
import update from 'api-functions/submissions/update'

const handler = createRequestHandler({
  GET: {
    authenticate: true,
    handler: show
  },
  PUT: {
    authenticate: false,
    handler: update
  }
})

export default handler
