import Stripe from "stripe";

import { STRIPE_API_KEY } from "lib/config/env.config";

/**
 * Payments client.
 */
const payments = new Stripe(STRIPE_API_KEY as string);

export default payments;
