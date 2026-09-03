import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection across hot reloads in dev — without this, every
// file change reconnects and eventually exhausts MongoDB's connection pool.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cache;

export async function connectToDatabase() {
  // Fail fast at connection time rather than module evaluation, so builds
  // and static analysis can import this module without a configured database.
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI as string).catch((e) => {
      cache.promise = null;
      throw e;
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
