import { config } from "@/config/config";
import mongoose from "mongoose";
const { MONGODB_URI } = config;

type connectionObject = {
    isConnected?: number
}

const connection:connectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        return
    };

    try {
        const db = await mongoose.connect(MONGODB_URI || "", {})
        console.log("db", db);

        connection.isConnected = db.connections[0].readyState
        console.log(connection);
        
        console.log("DB Connected Successfully!");

    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1)
    }
}

export default dbConnect;
