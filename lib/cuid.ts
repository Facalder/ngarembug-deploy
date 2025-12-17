import { init } from "@paralleldrive/cuid2";

export const createId = init({
  length: 10,
  random: Math.random,
  fingerprint: "a-custom-host-fingerprint",
});
