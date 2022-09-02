import { nanoid } from "nanoid";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { AppDataSource } from "../data-source";
import { getNewFileName } from "../services/fileRelated";
import { SubscriptionType } from "./SubscriptionType";
import { User } from './User';
@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 25, nullable: true })
    pictureName: string;

    @CreateDateColumn()
    subscriptionDate: Date;

    @ManyToOne(() => User, (user: User) => user.subscriptions)
    user: User;

    @ManyToOne(()=>SubscriptionType, (type: SubscriptionType)=>type.subscriptions)
    type: SubscriptionType;

    constructor(fileName:string) {
        this.setPictureName(fileName);
    }

    async setPictureName(fileName:string){
        let temp: string, found: Partial<Subscription> | null;
        do{
            temp= getNewFileName(nanoid(10), fileName);
            found= await AppDataSource.manager
                .createQueryBuilder(Subscription, "subscription")
                .where("subscription.pictureName= :fileName", {fileName: temp})
                .getOne()
        }while(found);
    
        this.pictureName= temp;
    }
}