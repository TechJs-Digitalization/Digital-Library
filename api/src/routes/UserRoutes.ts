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

//Create a new user
// router.post("/", [checkJwt, checkIfAdmin], UserController.newUser);

//Edit one user
.put(
    "/",
    [checkJwt],
    UserController.editUser
)

//Delete one user
.delete(
    "/:id([0-9]+)",
    [checkJwt, checkIfAdmin],
    UserController.deleteUser
)

export default router;


/*export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}]*/