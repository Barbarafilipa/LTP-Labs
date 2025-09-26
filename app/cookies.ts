import { createCookie } from "@remix-run/node";

export const cartCookie = createCookie("cart", {
  maxAge: 60 * 60 * 24 * 7, // 7 dias
});
