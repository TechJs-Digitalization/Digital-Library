import { nanoid } from "nanoid";
import { Entity, ManyToOne } from "typeorm";
import { AppDataSource } from "../data-source";
import { getNewFileName } from "../services/fileRelated";
import { Picture } from "./abstract/Pictures";
import { Author } from "./Author";

@Entity()
export class AuthorPicture extends Picture{
    @ManyToOne(()=>Author, (author: Author)=>author.authorPics)
    author: Author;

    constructor(fileName:string){
        super();
        this.setRandomFileName(fileName);
    }
    
    protected async setRandomFileName(fileName:string){
        let temp: string, found: Partial<AuthorPicture> | null;
        do{
            temp= getNewFileName(nanoid(10), fileName);
            found= await AppDataSource.manager
                .createQueryBuilder(AuthorPicture, "authorPicture")
                .where("authorPicture.fileName= :fileName", {fileName: temp})
                .getOne()
        }while(found);
    
        this.fileName= temp;
    }
}