This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) for the assignment. A published version is [avaiable online](https://aladin-assignment.vercel.app).

## Getting Started

I used pnpm as the package manager, clone the repository, then install (you can use Yarn, it will just be slower as there's no yarn lockfile).

```bash
pnpm i
```

Create a local mongodb replicaset or use MongoDB Atlas, then set the environment variable. Generate the prisma client by running

```bash
pnpm prisma generate
```

Note, for the `DATABASE_URL` environment variable, create a `.env.development.local` to override what's in `.env.development` as `.env.development.local` will not be comitted into the repo.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also preview the work online at: https://aladin-assignment.vercel.app

## Directions
Start by opening `pages/index.ts`, the component uses SSG to preload the question.
You can login with any username, the progress is saved by username.
The pages/api folder contains some light api code, just entrypoints, the bulk of the API resides inside `api-functions` folder.

## Note
No code has been reused from any of my projects, some elements are not thouroughly built.
For tests, I have built only 3 tests for now, just as an example. If a complete test of the project is necessary, do let me know and I'll do all the tests with coverage.