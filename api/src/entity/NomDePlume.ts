import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./Author";

@Entity()
export class NomDePlume{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 40})
    value: string;

    @ManyToOne(()=>Author, (author: Author)=>author.nomDePlumes)
    author: Author;   
}