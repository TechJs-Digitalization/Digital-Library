import { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";

const routes = Router();

routes.use("/auth", AuthRoutes);
routes.use("/users", UserRoutes);

export default routes;