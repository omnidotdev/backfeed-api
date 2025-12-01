# load environment variables
load("ext://dotenv", "dotenv")

dotenv(fn=".env.local")

project_name = "backfeed-api"
port = 4000

local_resource(
    "install-deps-%s" % project_name,
    cmd="bun i",
    deps=["package.json"],
    labels=[project_name],
)

local_resource(
    "dev-%s" % project_name,
    serve_cmd="bun dev",
    labels=[project_name],
)

local_resource(
    "studio-%s" % project_name,
    serve_cmd="bun db:studio",
    labels=[project_name],
)

local_resource(
    "payment-webhooks-tunnel-%s" % project_name,
    serve_cmd="stripe listen --forward-to localhost:%s/webhooks/stripe" % port,
    labels=[project_name],
)
