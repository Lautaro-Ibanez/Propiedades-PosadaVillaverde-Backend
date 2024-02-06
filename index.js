import express from "express";
import cluster from "cluster";
import os from "os";
import mongoose from "mongoose";
import config from "./src/config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import initializePassport from "./src/config/passport.config.js";

import propertyRouter from "./src/routes/property-router.js";
import sessionRouter from "./src/routes/session-router.js";

import __dirname from "./src/util.js";

const cpus = os.cpus().length;
const connection = mongoose.connect(config.mongoURL);

if (cluster.isPrimary) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", () => {
    cluster.fork();
  });
} else {
  /*--------------------------  Server  --------------------------*/
  const app = express();
  const PORT = process.env.port || 8080;

  const corsOptions = {
    origin: "http://localhost:5174",
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));
  app.use(cookieParser());

  initializePassport();

  /*--------------------------  Routes  --------------------------*/

  app.use("/api/propertys", propertyRouter);
  app.use("/api/sessions", sessionRouter);

  const server = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}`)
  );
}
