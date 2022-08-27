import { fireEvent, render, screen, waitFor } from './utils/testing'
import Home from 'pages/index'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { DUMMY_QUESTIONNAIRE } from './fixtures/dummy-questionnaire'
import { useRouter } from 'next/dist/client/router'

jest.mock('js-cookie')
const USE_ROUTER = {
  query: {},
  pathname: '/',
  asPath: '/',
  events: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
}
jest.mock('next/dist/client/router', () => ({
  __esModule: true,
  useRouter: () => USE_ROUTER,
}))

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe('Home', () => {
  it('renders the seed button when there\'s no questionaire', () => {
    render(<Home />)

    const button = screen.getByTestId('seed-questionnaire')

    expect(button).toBeInTheDocument()
  })

  it('seeds the question', async () => {
    server.use(
      rest.post('http://localhost:3000/api/questionnaires', (_req, res, ctx) => {
        return res(ctx.json(DUMMY_QUESTIONNAIRE))
      })
    )

    render(<Home />)

    const button = screen.getByTestId('seed-questionnaire')
    fireEvent.click(button)
    await waitFor(() => screen.getByTestId('start-questionnaire'))

    expect(screen.getByTestId('start-questionnaire')).toHaveTextContent('Start the test')
  })

  it('creates a new submission with an unknown user', async () => {
    server.use(
      rest.post('http://localhost:3000/api/submissions', (_req, res, ctx) => {
        return res(ctx.json({
          isNew: true,
          submissionId: '123',
          authToken: 'abcd',
          step: 0,
          completed: false,
        }))
      }),
      rest.get('http://localhost:3000/api/submissions/123', (_req, res, ctx) => {
        return res(ctx.json(DUMMY_QUESTIONNAIRE))
      })
    )

    render(<Home questionnaire={DUMMY_QUESTIONNAIRE} />)

    const input = screen.getByTestId('username-input')
    fireEvent.change(input, { target: { value: 'someone' } })

    const button = screen.getByTestId('start-questionnaire')
    fireEvent.click(button)

    const popupMessage = await waitFor(() => screen.getByText('Your username is now saved and you will be able to continue the test just by providing your username.'))
    expect(popupMessage).toBeInTheDocument()

    const router = useRouter()

    expect(router.push).toHaveBeenCalled()
  })
})