import { AfterLoad, BeforeRemove, Check, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @Column('boolean')
    dispo!: boolean;

    @Column()
    available!: number;

    @Column({type: 'text'})
    synopsis!: string;

    @Column('varchar')
    coverPicture!: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=>BookCategory, (category: BookCategory)=>category.books, {onDelete: 'CASCADE'})
    category!: BookCategory;

    @ManyToOne(()=>Author, (author: Author)=>author.books, {onDelete: 'CASCADE'})
    author!: Author;

    @ManyToMany(()=>BookCheckout)
    bookChekouts: BookCheckout[];

    @AfterLoad()
    rectifyCoverPath(){
        if(this.coverPicture)
            this.coverPicture= '/public/bookPictures/' + this.coverPicture;
    }
}