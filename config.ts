const dev = process.env.NODE_ENV !== "production";
/**@TODO production server info */
export const server = dev ? "http://localhost:3000" : "production server";
