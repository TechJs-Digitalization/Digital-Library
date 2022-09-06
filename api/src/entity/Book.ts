import { Check, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookCategory } from "./BookCategory";
import { Author } from "./Author";
import { BookCheckout } from "./BookCheckout";
import { BookPicture } from "./BookPicture";

@Entity()
@Check(`"available">=0`)
export class Book{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    title!: string;

    @Column()
    available!: number;

    @Column({type: 'text'})
    synopsis!: string;

    @OneToMany(()=>BookPicture, (bookPic: BookPicture)=>bookPic.book, {cascade: true})
    bookPics: BookPicture[];

    @ManyToOne(()=>BookCategory, (category: BookCategory)=>category.books)
    category: BookCategory;

    @ManyToOne(()=>Author, (author: Author)=>author.books)
    author: Author;

    @ManyToMany(()=>BookCheckout)
    bookChekouts: BookCheckout[];
}