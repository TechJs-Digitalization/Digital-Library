import { Router } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import { checkJwt, checkLogedOut } from "../middlewares/checkJwt";
import { checkIfAdmin } from "../middlewares/checkRole";

const router = Router();

//create a new user
router.post('/signin', [checkLogedOut], UserController.newUser(false))

//create a new admin
.post('/newAdmin', [checkJwt, checkIfAdmin], UserController.newUser(true))

//Login route
.post("/login", [checkLogedOut], AuthController.login)

//change my password
.post("/change-password", [checkJwt], AuthController.changePassword)

//logout
.post("/logout", [checkJwt], AuthController.logout)

export default router;