// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    if (!client.isConnected) {
      await client.connect();
    }
    const db = client.db(process.env.MONGODB_DB); // Your database name
    return { db, client };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
