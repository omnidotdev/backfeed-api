/**
 * @file Generate a TLS certificate and key file. Requires `mkcert` to be installed.
 */

import { $ } from "bun";

await $`mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1 ::1`;
