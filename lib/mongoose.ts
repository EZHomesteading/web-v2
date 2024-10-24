import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }
  
  declare global {
    var mongoose: MongooseCache;
  }
  
  let cached = global.mongoose as MongooseCache;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongoose() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  console.log(cached.conn)
  return cached.conn;
}

export default connectMongoose;
