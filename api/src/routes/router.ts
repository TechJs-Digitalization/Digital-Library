import { Router } from "express";
import BookRoutes from "./book.router";
import CategoryRoutes from './category.router'
import UserRoutes from './UserRoutes';
import AuthRoutes from './authentification.router'

const router= Router();

router.use('/category', CategoryRoutes)

router.use('/book', BookRoutes);

router.use("/auth", AuthRoutes);

router.use("/users", UserRoutes);

export default router;