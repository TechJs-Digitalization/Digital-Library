import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./abstract/Person";
import { AuthorPicture } from "./AuthorPicture";
import { Book } from "./Book";
import { NomDePlume } from "./NomDePlume";

@Entity()
export class Author extends Person{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'date', default: null, nullable: true})
    dateOfDeath: Date | null;

    @Column('text')
    description: string;

    @OneToMany(()=>Book, (book: Book)=>book.author)
    books: Book[];
    
    @OneToMany(()=>AuthorPicture, (authorPics: AuthorPicture)=>authorPics.author, {cascade: ['remove']})
    authorPics: AuthorPicture[];

    @OneToMany(()=>NomDePlume, (ndp: NomDePlume)=>ndp.author, {cascade: ['remove']})
    nomDePlumes: NomDePlume[];

    constructor(firstName : string, lastName:string, dateOfBirth:Date, dateOfDeath?:Date){
        super(firstName, lastName, dateOfBirth);
        this.dateOfDeath= (dateOfDeath)? dateOfDeath : null;
    }
}