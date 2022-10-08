import { Router } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import { checkJwt, checkLogedOut } from "../middlewares/checkJwt";

const router = Router();

router.post('/signin', [checkLogedOut], UserController.newUser(false))

//Login route
.post("/login", [checkLogedOut], AuthController.login)

//change my password
.post("/change-password", [checkJwt], AuthController.changePassword)

//logout
.post("/logout", [checkJwt], AuthController.logout)

export default router;