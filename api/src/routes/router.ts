import { Router } from "express";
import bookRouter from "./book.router";

const router= Router();
router.use('/book', bookRouter);

export default router;