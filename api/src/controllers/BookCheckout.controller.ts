import { SubscriptionType } from "../entity/SubscriptionType";
import { Express } from "express"
import { NextFunction, Request, Response } from "express";
import { Subscription } from "../entity/Subscription";
import { BookCheckout } from "../entity/BookCheckout";
import {  Repository} from "typeorm/repository/Repository";
import { AppDataSource } from "../data-source";
import SubscriptionController from "./Subscription.controller";
import { StaticFile } from "./staticFile"
export default class BookCheckoutController {

    static subscription : Subscriptions ;
   static  subsciptiontype : SubscriptionType ;
    static subscriptionController = new SubscriptionController(
       BookCheckoutController.subscription , 
        5);
     maxOfBooks : number = BookCheckoutController.subscriptionController.maxOfBook ; 
    
     actualDate : Date = new Date();
    static subscriptionType: SubscriptionType;
        static #repository : Repository<BookCheckout>
        static {
            BookCheckoutController.#repository = AppDataSource.getRepository(BookCheckout);
        }
        
    constructor(
        subscriptionID : number,
        listOfBooksById : number[] ){
            
            this.subscriptionID = subscriptionID;
            this.listOfBooksById = listOfBooksById;
           
    }
    
    listOfBooksById : number[];
  
    dateVerification: Date = BookCheckoutController.subscription.subscriptionDate ;
    subscriptionID : number ;
    numberOfBookThisMonth : number ;
    
    private  async SetTheOrderOfBook  ( list: number[] )   {
        for ( var i = 0; i < list.length; i ++) {
            if( Number.isInteger(list[i]) ){
                   let result = await BookCheckoutController.#repository.findOne({
                    where: {
                        
                        id: list[i]
                    }
                    
                     
                })
                if (result){
                    this.listOfBooksById[i] = list[i]
                }else  {
                    return false;
                }
                
            }else {return false }
             return this.listOfBooksById;
        }
    }


  private checkoutIfSubmitIsFinished =  (dateToCompare: Date , subscription : number  ) : boolean =>{
    // verifier si la subscription ayant cette id existe dans la table

    return (this.dateVerification > dateToCompare  ) ? true : false;
}

    private validateTheOrderByBookRead = (numberOfBook : number , 
        subscription : number)  => {
            let result = this.SetTheOrderOfBook(this.listOfBooksById);
            if (result  instanceof Array){
                return (this.maxOfBooks < numberOfBook ) ? false :true;
            }else {
                return false
            }
       }

   
   
   
   
validateTheOrderOfBook = async ( req : Request, res : Response, next : NextFunction )  => {
    const permissionByCheckBookRead = this.validateTheOrderByBookRead (
        this.numberOfBookThisMonth , 
        this.subscriptionID );
    const permissionByCheckSubmit = this.checkoutIfSubmitIsFinished (this.actualDate , this.subscriptionID ) ;
    //actualDate =daty androany 
        try {
            
            if (permissionByCheckSubmit && permissionByCheckBookRead ) {
                res.status(200).send(" The order has been received");
                return this.listOfBooksById; 
                
            } else if (!permissionByCheckSubmit) {
                res.status(401).send(" the submit has been already finished  ");
                return false;
            }else   {
                res.status(401).send(" the maximum of number of book submissions is exceeded")
                return false;
            }

        
        }catch (err ) {
            res.status(401).send(" we cannot to take the order");
            return false
        }

            
    }
}



