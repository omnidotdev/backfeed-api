# Backfeed API

Backfeed is an open-source feedback reporting platform.

## Local Development

First, `cp .env.local.template .env.local` and fill in the values.

### Building and Running

Install dependencies:

```sh
bun install
```

Setup the database (only required once, to create the database):

```sh
bun db:setup
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

Our Backfeed payment processor, [Stripe](https://stripe.com), issues webhooks. Webhooks are used in this project for realtime updates. Webhook events can be received locally through the following steps:

First, follow the steps to download the Stripe CLI and authenticate at the [Stripe CLI installation guide](https://docs.stripe.com/stripe-cli/install).

> [!NOTE]
> If you are completing the login through the browser, make sure you are currently signed in through the proper environment as each environment exposes its own API key.

Once logged in with the Stripe CLI, use the following command to forward snapshot events to your local listener, setting `PORT` as necessary:

```sh
stripe listen --forward-to localhost:$PORT/webhooks/stripe
```

This will provide a webhook signing secret, which you will need to fill in the `STRIPE_WEBHOOK_SECRET` environment variable.

From there, webhook events will be forwarded to the local listener. You can manage the events within the webhooks route under the `/webhooks/stripe` endpoint found in [`src/server.ts`](src/server.ts).

## License

The code in this repository is licensed under MIT, &copy; Omni LLC. See [LICENSE.md](LICENSE.md) for more information.
