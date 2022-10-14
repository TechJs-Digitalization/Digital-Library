import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkIfAdmin } from "../middlewares/checkRole";

const router = Router();

//Get all users
router.get("/", [checkJwt, checkIfAdmin], UserController.listAll)

// Get one user
.get(
    "/:id([0-9]+)",
    [checkJwt, checkIfAdmin],
    UserController.getOneById
)
//Edit one user
.put(
    "/:id([0-9]+)",
    [checkJwt, checkIfAdmin],
    UserController.editUser
)

//Delete one user
.delete(
    "/:id([0-9]+)",
    [checkJwt, checkIfAdmin],
    UserController.deleteUser
)

export default router;