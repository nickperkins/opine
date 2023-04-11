# Opine

This is a minimal api for comments on a static blog, built to run on Cloudflare Workers.
This is a proof of concept that is not suitable for production.

This has been inspired by the [Hono blog example](https://github.com/honojs/examples/tree/main/blog)

## Features

- Data stored in Cloudflare D1
- Written in Typescript, using Hono framework

## Usage

Install

```sh
yarn install
```

Run migrations (Local Development)

```sh
yarn dev-migrate
```

Local Development

```sh
yarn dev
```

Test

```sh
yarn test
```

Deploy

```sh
yarn deploy
```

Run migrations

```sh
yarn migrate
```
