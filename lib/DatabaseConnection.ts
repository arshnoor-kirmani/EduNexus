import mongoose from "mongoose";

export type ConnectionObject = {
  isConnected?: number;
  dbName?: string;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: ConnectionObject;
};

export default async function dbConnect(
  databaseName?: string
): Promise<ConnectionObject> {
  const cached = globalWithMongoose.mongooseConnection;

  if (
    cached?.isConnected === 1 &&
    (cached.dbName === databaseName ||
      cached.dbName === process.env.DATABASE_NAME)
  ) {
    console.log(`✅ Reusing cached connection: ${mongoose.connection.name}`);
    return cached;
  }

  const currentDb = mongoose.connection.name;
  if (
    mongoose.connection.readyState === 1 &&
    (currentDb !== databaseName || currentDb === process.env.DATABASE_NAME)
  ) {
    console.log(`⚠️ Closing connection to old DB: ${currentDb}`);
    await mongoose.connection.close();
  }

  const baseUrl = process.env.MONGODB_URL;
  if (!baseUrl) throw new Error("❌ MONGODB_URL missing in .env!");

  // Detect if base URL already has a DB name
  const hasDbName = new URL(baseUrl).pathname.replace(/^\//, "").length > 0;

  let connectionUri = baseUrl.replace(/\/+$/, "");

  if (!hasDbName) {
    if (!databaseName) {
      connectionUri = `${connectionUri}/${process.env.DATABASE_NAME}`;
    } else {
      connectionUri = `${connectionUri}/${databaseName}`;
    }
  }

  if (!connectionUri.includes("?")) {
    connectionUri += `?retryWrites=true&w=majority`;
  }

  try {
    const db = await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log(`🔗 Connected to MongoDB: ${db.connection.name}`);

    const connection: ConnectionObject = {
      isConnected: db.connection.readyState,
      dbName: db.connection.name,
    };

    globalWithMongoose.mongooseConnection = connection;
    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw new Error("Database connection failed");
  }
}
