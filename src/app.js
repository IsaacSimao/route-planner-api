import express from "express";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/routes", routeRoutes);

export default app;
