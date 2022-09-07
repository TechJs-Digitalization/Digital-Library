import { Entity, ManyToOne } from "typeorm";
import { Picture } from "./abstract/Pictures";
import { Book } from "./Book";

@Entity()
export class BookPicture extends Picture{
    @ManyToOne(()=>Book, (book)=>book.bookPics)
    book: Book;

    constructor(fileName:string){
        super();
        this.fileName= fileName;
    }
}