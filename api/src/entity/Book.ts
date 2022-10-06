import { AfterLoad, Check, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookCategory } from "./BookCategory";
import { Author } from "./Author";
import { BookCheckout } from "./BookCheckout";

@Entity()
@Check(`"available">=0`)
export class Book{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar')
    title!: string;

    @Column()
    available!: number;

    @Column({type: 'text'})
    synopsis!: string;

    @Column('varchar')
    coverPicture!: string;

    @ManyToOne(()=>BookCategory, (category: BookCategory)=>category.books)
    category!: BookCategory;

    @ManyToOne(()=>Author, (author: Author)=>author.books)
    author!: Author;

    @ManyToMany(()=>BookCheckout)
    bookChekouts: BookCheckout[];

    @AfterLoad()
    updateCoverPath(){
        this.coverPicture= '/public/bookPictures/' + this.coverPicture;
    }
}