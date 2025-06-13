export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Sociability Web Store";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "An e-commerce shop for accessible toys and clothes from independent suppliers.";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultvalues = {
  email: "",
  password: "",
};
export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultvalues = {
  fullName: "John Doe",
  streetAddress: "123 main Street",
  city: "Downtown",
  postCode: "123456",
  country: "England",
};
