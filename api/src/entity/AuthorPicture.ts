import { Entity, ManyToOne } from "typeorm";
import { Picture } from "./abstract/Pictures";
import { Author } from "./Author";

@Entity()
export class AuthorPicture extends Picture{
    @ManyToOne(()=>Author, (author: Author)=>author.authorPics)
    author: Author;

    constructor(fileName:string, cover:boolean=false){
        super(cover);
        this.fileName= fileName;
    }
}