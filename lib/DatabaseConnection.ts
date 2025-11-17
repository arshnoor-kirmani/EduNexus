import mongoose from "mongoose";

export type ConnectionObject = {
  isConnected?: number;
  dbName?: string;
};

// Reuse the same connection in dev/hot reload
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseConnection?: ConnectionObject;
};

export default async function dbConnect(
  databaseName: string
): Promise<ConnectionObject> {
  // Check for existing cached connection
  if (
    globalWithMongoose.mongooseConnection?.isConnected === 1 &&
    globalWithMongoose.mongooseConnection?.dbName === databaseName
  ) {
    console.log(`✅ Using existing database connection: ${databaseName}`);
    return globalWithMongoose.mongooseConnection;
  }

  // Close previous connection if database name changed
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.connections[0]?.name !== databaseName
  ) {
    console.log(
      `⚠️ Closing previous connection to ${mongoose.connections[0]?.name}...`
    );
    await mongoose.connection.close();
  }

  try {
    // Build connection string
    const url =
      databaseName === "institutes"
        ? `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
        : `${process.env.MONGODB_URL}/${databaseName}?retryWrites=true&w=majority`;

    // Establish new connection
    const db = await mongoose.connect(url, { maxPoolSize: 10 });
    console.log(`Connected to MongoDB: ${db.connection.name}`);

    const connection: ConnectionObject = {
      isConnected: db.connections[0].readyState,
      dbName: db.connections[0].name,
    };

    // Cache connection globally (prevents hot reload duplication)
    globalWithMongoose.mongooseConnection = connection;

    return connection;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error("Database connection failed");
  }
}
