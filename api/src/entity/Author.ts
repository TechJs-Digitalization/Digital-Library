import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./Person";
import { Book } from "./Book";

@Entity()
export class Author extends Person{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 40})
    nomDePlume: string;

    @Column({type: 'date', default: null, nullable: true})
    dateOfDeath: Date | null;

    @OneToMany(()=>Book, (book: Book)=>book.author)
    books: Book[];

    constructor(firstName : string, lastName:string, nomDePlume: string, dateOfBirth:Date, dateOfDeath?:Date){
        super(firstName, lastName, dateOfBirth);
        this.nomDePlume= nomDePlume;
        this.dateOfDeath= (dateOfDeath)? dateOfDeath : null;
    }
}