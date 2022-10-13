import { Router } from "express";
import BookCategoryController from "../controllers/bookCategory.controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkIfAdmin } from "../middlewares/checkRole";
import normalizeQuery from "../middlewares/queryNormalize";

const categoryRouter= Router();

categoryRouter.get('/bookInCategory/:id', normalizeQuery(['createdAt','title']), BookCategoryController.getBookInCategory(false))

.get('/allBookInCategory/:id', [checkJwt, checkIfAdmin, normalizeQuery(['createdAt','title'])], BookCategoryController.getBookInCategory(true))

.get('/:id', BookCategoryController.getInfo())

.get('/withHiddendInfo/:id', [checkJwt, checkIfAdmin], BookCategoryController.getInfo(true))

.post('/', [checkJwt, checkIfAdmin], BookCategoryController.save)

.put('/:id', [checkJwt, checkIfAdmin], BookCategoryController.update)

.delete('/:id', [checkJwt, checkIfAdmin], BookCategoryController.delete)

export default categoryRouter;