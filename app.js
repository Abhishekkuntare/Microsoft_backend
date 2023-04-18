import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/Error.js";
import express from "express";

//config
import { config } from "dotenv";
config({ path: "./config/config.env" });

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

//routes
import user from "./routes/userRoutes.js";
import game from "./routes/gameRoutes.js";
import apps from "./routes/appsRouter.js";
import other from "./routes/otherRoutes.js";

app.use("/api/v1", user);
app.use("/api/v1", game);
app.use("/api/v1", apps);
app.use("/api/v1", other);

export default app;

app.get("/", (req, res) => {
  res.send(
    `<h1>Site is working click front on <a href=${process.env.FRONTEND_URL}>here</a></h1>`
  );
});

app.use(ErrorMiddleware);
