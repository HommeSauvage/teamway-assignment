import { createRequestHandler } from 'lib/server'
// import show from 'api-functions/submissions/show'
import update from 'api-functions/submissions/answer'

const handler = createRequestHandler({
  // GET: {
  //   authenticate: true,
  //   handler: show
  // },
  PUT: {
    authenticate: true,
    handler: update
  }
})

export default handler
