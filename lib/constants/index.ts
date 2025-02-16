export const APP_NAME = process.env.NEXT_PUBILC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBILC_APP_DESCRIPTION ||
  "A modern ecommerce platform built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCT_LIMIT =
  Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "Hamza Muhd",
  streetAddress: "369 Dukawuyya",
  city: "Kano",
  postalCode: "700321",
  country: "Nigeria",
};
