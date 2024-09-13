# find broken links

Quick script to crawl a website and find broken links. Generates a markdown report of all broken links.

install

```bash
git clone ...
cd repo
npm ci
```

## Usage

Adjust the `siteUrl` variable in `index.ts`.
Then run:

```bash
npx tsx index.ts
```

## Development

```bash
npm run test:server
```

In another terminal:

```bash
# no watch mode for now
npx tsx index.ts
```
