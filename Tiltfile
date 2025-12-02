v1alpha1.extension_repo(name='omni', url='https://github.com/omnidotdev/tilt-extensions')
v1alpha1.extension(name='dotenv_values', repo_name='omni', repo_path='dotenv_values')
load('ext://dotenv_values', 'dotenv_values')

env_local = dotenv_values(".env.local")
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
    env=env_local,
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
