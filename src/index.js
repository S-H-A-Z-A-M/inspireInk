// require('dotenv').config({path: './env'});

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("ERRRR", err);
    });
  })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`The server is listening on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!, ", err);
  });

// import express from "express";

// const app = express();
// (async () => {
//   try {
//     const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (err) => {
//       console.error("ERRRR", err);
//       throw err;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log("listening on port " + process.env.PORT);
//     });
//   } catch (error) {
//     console.error("ERROR: " + error);
//     throw error;
//   }
// })();