import { IsDate, IsNotEmpty } from "class-validator";
import { basename, join } from "path";
import { AfterLoad, BeforeRemove, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { authorCoverDir, bookCoverDir } from "../config/pathFiles";
import { AppDataSource } from "../data-source";
import { DateIsSupThan } from "../services/dateValidation";
import { deleteFile } from "../services/fileUpload";
import { Person } from "./abstract/Person";
import { Book } from "./Book";
import { NomDePlume } from "./NomDePlume";

@Entity()
export class Author extends Person{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'date', default: null, nullable: true})
    @DateIsSupThan('dateOfBirth')
    dateOfDeath: Date | null;

    @Column({type: 'text', default: null, nullable: true})
    description: string | null;

    @Column('varchar', {nullable: false})
    @IsNotEmpty({message: 'Please upload a cover picture for this author'})
    coverPicture: string | null;

    @OneToMany(()=>Book, (book: Book)=>book.author)
    books: Book[];

    @OneToMany(()=>NomDePlume, (ndp: NomDePlume)=>ndp.author, {cascade: true})
    nomDePlumes: NomDePlume[];

    @AfterLoad()
    rectifyCoverPath(){
        if(this.coverPicture)
            this.coverPicture= '/public/authorPictures/' + this.coverPicture;
    }

    @BeforeRemove()
    async deleteCoverOfAllBook(){
        try {
            const coverPictures= await AppDataSource.getRepository(Book).find({
                relations: {'author': true},
                select: ['coverPicture'],
                where: {
                    category: {id: this.id}
                } 
            })
            await deleteFile(
                ...coverPictures.map(file => join(bookCoverDir, basename(file.coverPicture)))
            )

            const authorPic= await AppDataSource.getRepository(Author).findOne({
                select: ['coverPicture'],
                where: {id: this.id}
            })

            await deleteFile(join(authorCoverDir, basename((authorPic as any).coverPicture as any)))
        } catch (error) {
            console.error('Error')
        }
    }

    constructor(firstName? : string, lastName?:string, coverPicture?: string, dateOfBirth?:Date, dateOfDeath?:Date, description?:string, nomDePlume?: string[]){
        super(firstName, lastName, dateOfBirth);
        this.description= (description)? description : null;
        this.dateOfDeath= (dateOfDeath)? dateOfDeath : null;
        this.coverPicture= (coverPicture)? coverPicture : '';
        if(nomDePlume){
            this.nomDePlumes= nomDePlume.map((val)=> {return {value: val}}) as any;
        }
    }
}