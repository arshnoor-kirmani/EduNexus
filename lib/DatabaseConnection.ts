import mongoose from "mongoose";

export type ConnectionObject = {
  isConnected: number;
  dbName: string;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: ConnectionObject;
};

export default async function dbConnect(
  databaseName?: string
): Promise<ConnectionObject> {
  const MONGO_BASE = process.env.MONGODB_URL;
  const DEFAULT_DB = process.env.DATABASE_NAME;

  if (!MONGO_BASE) {
    throw new Error("❌ MONGODB_URL missing in .env");
  }

  const targetDb = databaseName || DEFAULT_DB;

  // Reuse connection if DB is same
  if (
    globalWithMongoose.mongooseConnection &&
    globalWithMongoose.mongooseConnection.isConnected === 1 &&
    globalWithMongoose.mongooseConnection.dbName === targetDb
  ) {
    console.log(`🔁 Reusing cached connection: ${targetDb}`);
    return globalWithMongoose.mongooseConnection;
  }

  let connectionUri = MONGO_BASE.replace(/\/+$/, "");

  // If MongoDB URL does not have a DB name, append one
  const path = new URL(MONGO_BASE).pathname.replace(/^\//, "");
  if (!path) {
    connectionUri += `/${targetDb}`;
  }

  // Add parameters if not present
  if (!connectionUri.includes("?")) {
    connectionUri += "?retryWrites=true&w=majority";
  }

  try {
    const db = await mongoose.connect(connectionUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 6000,
    });

    console.log(`✅ Connected to MongoDB: ${db.connection.name}`);

    const connection: ConnectionObject = {
      isConnected: db.connection.readyState,
      dbName: db.connection.name,
    };

    // Cache new connection
    globalWithMongoose.mongooseConnection = connection;

    return connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw new Error("Database connection failed");
  }
}
