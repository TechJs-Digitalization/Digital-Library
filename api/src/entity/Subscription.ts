import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {User} from './User';

export enum SUBSCRIPTION_TYPE{ test1, test2 }

@Entity()
export class Subscription{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: SUBSCRIPTION_TYPE,
        default: SUBSCRIPTION_TYPE.test1
    })
    type: SUBSCRIPTION_TYPE;

    @CreateDateColumn()
    subscriptionDate: Date;

    @ManyToOne(()=>User, (user: User)=>user.subscriptions)
    user: User;

    constructor(type: SUBSCRIPTION_TYPE){
        this.type= type;
    }
}