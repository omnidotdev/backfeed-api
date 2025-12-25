import { STRIPE_API_KEY } from "lib/config/env.config";
import Stripe from "stripe";

/**
 * Payments client.
 */
const payments = new Stripe(STRIPE_API_KEY as string);

export default payments;
