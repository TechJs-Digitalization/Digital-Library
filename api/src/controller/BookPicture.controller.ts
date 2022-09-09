import { Request, Response } from "express";
import formidable from "formidable";
import path from "path";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { BookPicture } from "../entity/BookPicture";

class BookPictureController{
    private readonly repository: Repository<BookPicture>;
    readonly pictureDir= path.join(__dirname, '..','..','public', 'bookPictures');

    constructor(){
        this.repository= AppDataSource.getRepository(BookPicture);
    }

    public async save(...fileNameList: string[]){
        let promises= [];
        for(let fileName of fileNameList){
            promises.push(
                this.repository.save({
                    fileName: fileName
                })
            )
        }
        return await Promise.all(promises);
    }
}

export const bookPictureController= new BookPictureController();