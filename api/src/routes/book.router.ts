import { Router, Request, Response } from "express";
import { bookController } from "../controller/book.controller";

const bookRouter: Router= Router();

bookRouter.get('/:id', async (req: Request, res: Response)=>{
    const book= await bookController.getAllInfoSingleBook(req, res)
    if(!book)
        res.status(500).json({err: true, msg: 'Book not found'});
    else
        res.status(200).json({err: false, ...book});
})

.get('/', async (req: Request, res: Response)=>{
    res.status(200).json({msg: 'miainga'})
})

.post('/', async (req: Request, res: Response)=>{
    bookController.saveBook(req, res);
})

export default bookRouter;