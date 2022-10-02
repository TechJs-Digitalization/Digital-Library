import { Router, Request, Response } from "express";
import formidable from "formidable";
import { authorController } from "../controller/author.controller";
import BookController  from "../controller/book.controller";
import { bookCategoryController } from "../controller/bookCategory.controller";
import { deleteFile, getBasenames } from "../services/fileUpload";

const bookRouter: Router = Router();

bookRouter.get('/', async (req: Request, res: Response) => {
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

    .post('/', async (req: Request, res: Response) => {
        const form = formidable({
            allowEmptyFiles: false,
            keepExtensions: true,
            multiples: true,
            maxFileSize: 20 * 1024 * 1024, //20MB 
            uploadDir: BookController.pictureDir,
            filter: function ({ name, originalFilename, mimetype }) {
                return (mimetype) ? mimetype.includes('image') : false;
            }
        });

        form.parse(req, async (err: Error, fields, files) => {
            if (err) throw err;
            try {
                
                if (!files.cover) throw new Error('Please upload a cover picture file');
                if (!files.pictures) throw new Error('Please upload at least one illustration picture file');
                
                const [title, synopsis]= forceStringType(fields.title, fields.synopsis);
                if (!title) throw new Error('Title field cannot be null');
                if (!synopsis) throw new Error('Synopsis field cannot be null');

                //verify if the author exist
                const categoryIdNumber = Number(fields.categoryId);
                if(!categoryIdNumber) throw new Error('Category not found');
                const foundCategory = await bookCategoryController.get(categoryIdNumber);
                if (!foundCategory) throw new Error('Category not found');

                //verify if the category exist
                const authorIdNumber = Number(fields.authorId);
                if(!authorIdNumber) throw new Error('Author not found');
                const foundAuthor = await authorController.get(authorIdNumber);
                if (!foundAuthor) throw new Error('Author not found');

                //verify if the available number is a cor
                const availableNumber = Number(fields.available);
                if (!Number.isInteger(availableNumber) || availableNumber < 0) throw new Error('Invalid available number');


                const bookAlreadyExist = await BookController.verifyIfExistByAuthor(title, authorIdNumber);
                if (bookAlreadyExist) throw new Error('This book written by the concerned author already exists')
                else {
                    const coverName = getBasenames(('size' in files.cover) ? files.cover : files.cover[0])!;
                    const picsNames = getBasenames(...('length' in files.pictures) ? files.pictures : [files.pictures])!;

                    await BookController.save(title, synopsis, foundAuthor, availableNumber, foundCategory, coverName[0], picsNames);
                    res.status(201).json({ err: false, msg: 'Book successfully created' });
                }
            } catch (error) {
                if (error instanceof Error)
                    return res.status(400).json({ err: true, msg: error.message })
            }
        })
    })

    .put('/:id', async (req: Request, res: Response) => {
        const form = formidable({
            allowEmptyFiles: false,
            keepExtensions: true,
            multiples: true,
            maxFileSize: 20 * 1024 * 1024, //20MB 
            uploadDir: BookController.pictureDir,
            filter: function ({ name, originalFilename, mimetype }) {
                return (mimetype) ? mimetype.includes('image') : false;
            }
        });

        form.parse(req, async (err: Error, fields, files) => {
            if (err) throw err;
            try {
                const id = Number(req.params.id);
                const found = await BookController.verifyBookExist(id);
                if (!found) throw new Error(`Can't find the book to update`);

                const author = Number(fields.author)
                const available = Number(fields.available);
                const category = Number(fields.category);
                const [title, synopsis]= forceStringType(fields.title, fields.synopsis);
                if (!title) throw new Error('Title field cannot be null');
                if (!synopsis) throw new Error('Synopsis field cannot be null');

                const coverName = getBasenames(('size' in files.cover) ? files.cover : files.cover[0]);

                if(coverName){
                    const previousCover= await BookController.getCoverPicture(id) as string;
                    console.log(previousCover);
                    
                    deleteFile(previousCover)
                    
                    await BookController.update(id, title, synopsis, author, available, category, coverName[0]);
                }
                else
                    await BookController.update(id, title, synopsis, author, available, category);

                res.status(200).json({ msg: 'Book successfully' });
            } catch (error) {
                if (error instanceof Error)
                    return res.status(400).json({ err: true, msg: error.message })
            }
        })
    })

function forceStringType(...tab:(string | string[])[]): string[]{
    return tab.map(el => (((typeof el) == 'string' || !el) ? el : el[0]) as string);
}

export default bookRouter;