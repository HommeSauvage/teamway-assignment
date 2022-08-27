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
