import { SubscriptionType } from "../entity/SubscriptionType";
import { Express } from "express"
import { NextFunction, Request, Response } from "express";
import { Subscription } from "../entity/Subscription";
import { BookCheckout } from "../entity/BookCheckout";
import {  Repository} from "typeorm/repository/Repository";
import { AppDataSource } from "../data-source";
import SubscriptionController from "./Subscription.controller";
import { User } from "../entity/User"
import { Book } from "../entity/Book"
import { StaticFile } from "./staticFile"
export default class BookCheckoutController {

    static subscription : Subscription ;
   static  subsciptiontype : SubscriptionType ;
    static subscriptionController = new SubscriptionController(
       BookCheckoutController.subscription , 
        5);
     maxOfBooks : number = BookCheckoutController.subscriptionController.maxOfBook ; 
    
     actualDate : Date = new Date();
    static subscriptionType: SubscriptionType;
        static #repository : Repository<Book>
        static {
            BookCheckoutController.#repository = AppDataSource.getRepository(Book);
        }
        
    constructor(
        subscriptionID : number,
        listOfBooksById : number[],
        user:User ){
            
            this.subscriptionID = subscriptionID;
            this.listOfBooksById = listOfBooksById;
            this.user = user;
           
    }
    user : User;
    
    listOfBooksById : number[];
  
    dateVerification: Date = BookCheckoutController.subscription.subscriptionDate ;
    subscriptionID : number ;
    numberOfBookThisMonth : number ;
    
protected  async SetTheOrderOfBook  ( list: number[] )   {
        for ( var i = 0; i < list.length; i ++) {
            if( Number.isInteger(list[i]) ){
                   let result = await BookCheckoutController.#repository.findOne({
                    where: {
                        idBook: list[i]
                    }
                });
            if (result){
                this.listOfBooksById[i] = list[i]
            }else  {
                return false;
            }
                
        }else {return false }
             return this.listOfBooksById;
     }
}


protected checkoutIfSubmitIsFinished =  (dateToCompare: Date , subscription : number  ) : boolean =>{
    // verifier si la subscription ayant cette id existe dans la table

    return (this.dateVerification > dateToCompare  ) ? true : false;
}

protected validateTheOrderByBookRead = (numberOfBook : number , 
        subscription : number)  => {
            let result = this.SetTheOrderOfBook(this.listOfBooksById);
            if (result  instanceof Array){
                return (this.maxOfBooks < numberOfBook ) ? false :true;
            }else {
                return false
            }
       }
protected checkIfABookIsWithUser = (user: User):boolean =>{
    
    return true;
}


}



