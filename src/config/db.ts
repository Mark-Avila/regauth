import mongoose from "mongoose";

async function connect() {
  if (process.env.MONGO_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err: unknown) {
      console.error(err);
      process.exit(1);
    }
  } else {
    console.error("Failed to connect");
  }
}

export default connect;
