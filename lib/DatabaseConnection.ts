import mongoose from "mongoose";

export type ConnectionObject = {
  isConnected?: number;
  dbName?: string;
};

// Global cache for dev/hot-reload
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: ConnectionObject;
};

export default async function dbConnect(
  databaseName: string
): Promise<ConnectionObject> {
  // ----------------------------------------
  // 1) Return cached connection (if same DB)
  // ----------------------------------------
  const cached = globalWithMongoose.mongooseConnection;

  if (cached?.isConnected === 1 && cached.dbName === databaseName) {
    console.log(`✅ Reusing cached connection to: ${databaseName}`);
    return cached;
  }

  // ----------------------------------------
  // 2) If connected to a different DB → close it
  // ----------------------------------------
  const currentState = mongoose.connection.readyState;
  const currentDb = mongoose.connections[0]?.name;

  if (currentState === 1 && currentDb && currentDb !== databaseName) {
    console.log(`⚠️ Closing connection to old DB: ${currentDb}`);
    await mongoose.connection.close();
  }

  // ----------------------------------------
  // 3) Build Connection String
  // ----------------------------------------
  const baseUrl = process.env.MONGODB_URL;
  if (!baseUrl) throw new Error("❌ MONGODB_URL is missing in env!");

  const resolvedDB =
    databaseName === "institutes" ? process.env.DATABASE_NAME : databaseName;

  if (!resolvedDB) throw new Error("❌ Database name is missing!");
  const connectionUri = `${baseUrl}/${resolvedDB}?retryWrites=true&w=majority`;

  // ----------------------------------------
  // 4) Connect to MongoDB
  // ----------------------------------------
  try {
    const db = await mongoose.connect(connectionUri, {
      maxPoolSize: 10,
    });

    console.log(`🔗 Connected to MongoDB: ${db.connection.name}`);

    const connection: ConnectionObject = {
      isConnected: db.connection.readyState,
      dbName: db.connection.name,
    };

    // Cache for reuse
    globalWithMongoose.mongooseConnection = connection;

    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
}
