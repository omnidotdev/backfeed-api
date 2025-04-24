# Backfeed API

Backfeed is an open-source feedback reporting platform.

## Local Development

First, create a Postgres database called `backfeed`. Then, `cp .env.local.template .env.local` and fill in the values.

### Building and Running (Native)

Install dependencies:

```sh
bun install
```

Run database migrations:

```sh
bun db:migrate
```

Run the dev server:

```sh
bun run dev
```

### Webhooks (Payments)

Our Backfeed payment processor, [Polar](https://polar.sh), issues webhooks. Webhooks are used in this project for realtime updates. Webhooks can be managed at https://sandbox.polar.sh/dashboard/$ORGANIZATION_NAME/settings/webhooks.

## License

The code in this repository is licensed under MIT, &copy; Omni LLC. See [LICENSE.md](LICENSE.md) for more information.
