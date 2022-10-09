import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubscriptionType } from "./SubscriptionType";
import { User } from './User';
@Entity()
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    subscriptionDate: Date;

    @ManyToOne(() => User, (user: User) => user.subscriptions)
    user: User;

    @ManyToOne(()=>SubscriptionType, (type: SubscriptionType)=>type.subscriptions)
    type: SubscriptionType;
}