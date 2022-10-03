import { Router, Request, Response, NextFunction } from "express";
import formidable from "formidable";
import BookController  from "../controllers/book.controller";
import { authorController } from "../controllers/author.controller";
import { bookCategoryController } from "../controllers/bookCategory.controller";
import {formidableMiddleware} from "../middlewares/formidable";
import * as bookVerification from "../middlewares/bookVerification";
import { deleteFile, getBasenames } from "../services/fileUpload";

const bookRouter: Router = Router();
bookRouter.use(formidableMiddleware({
    allowEmptyFiles: false,
    keepExtensions: true,
    multiples: true,
    maxFileSize: 20 * 1024 * 1024, //20MB 
    uploadDir: BookController.pictureDir,
    filter: function ({ name, originalFilename, mimetype }) {
        return (mimetype) ? mimetype.includes('image') : false;
    }
}));

bookRouter.get('/', async (req: Request, res: Response, next) => {
    // next(new Error('test'));
    res.status(200).json({ msg: 'miainga' })
})

    .get('/:id', async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if(!Number.isNaN(id)){
            const book = await BookController.get(id);
            if (book)
                return res.status(200).json({ err: false, data: book });
        }

        res.status(404).json({ err: true, msg: 'Book not found' });
    })

    .post('/', [bookVerification.verify], BookController.save)

    // .put('/:id', async (req: Request, res: Response) => {
    //     const form = formidable({
    //         allowEmptyFiles: false,
    //         keepExtensions: true,
    //         multiples: true,
    //         maxFileSize: 20 * 1024 * 1024, //20MB 
    //         uploadDir: BookController.pictureDir,
    //         filter: function ({ name, originalFilename, mimetype }) {
    //             return (mimetype) ? mimetype.includes('image') : false;
    //         }
    //     });

    //     form.parse(req, async (err: Error, fields, files) => {
    //         if (err) return next(err;
    //         try {
    //             const id = Number(req.params.id);
    //             const found = await BookController.verifyBookExist(id);
    //             if (!found) return next(new Error(`Can't find the book to update`);

    //             const author = Number(fields.author)
    //             const available = Number(fields.available);
    //             const category = Number(fields.category);
    //             const [title, synopsis]= forceStringType(fields.title, fields.synopsis);
    //             if (!title) return next(new Error('Title field cannot be null');
    //             if (!synopsis) return next(new Error('Synopsis field cannot be null');

    //             const coverName = getBasenames(('size' in files.cover) ? files.cover : files.cover[0]);

    //             if(coverName){
    //                 const previousCover= await BookController.getCoverPicture(id) as string;
    //                 console.log(previousCover);
                    
    //                 deleteFile(previousCover)
                    
    //                 await BookController.update(id, title, synopsis, author, available, category, coverName[0]);
    //             }
    //             else
    //                 await BookController.update(id, title, synopsis, author, available, category);

    //             res.status(200).json({ msg: 'Book successfully' });
    //         } catch (error) {
    //             if (error instanceof Error)
    //                 return res.status(400).json({ err: true, msg: error.message })
    //         }
    //     })
    // })

    .use((err: Error, req: Request, res: Response, next: NextFunction)=>{
        console.log("eo");
        
        return res.status(400).json({ err: true, msg: err.message })
    });

function forceStringType(...tab:(string | string[])[]): string[]{
    return tab.map(el => (((typeof el) == 'string' || !el) ? el : el[0]) as string);
}

export default bookRouter;