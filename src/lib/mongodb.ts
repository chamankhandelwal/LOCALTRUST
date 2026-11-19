import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalWithMongoose = globalThis as typeof globalThis & { mongooseCache?: Cache };
const cache = globalWithMongoose.mongooseCache ??= { conn: null, promise: null };

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(process.env.MONGODB_URI!, { bufferCommands: false, maxPoolSize: 10 });
  try { cache.conn = await cache.promise; } catch (error) { cache.promise = null; throw error; }
  return cache.conn;
}
