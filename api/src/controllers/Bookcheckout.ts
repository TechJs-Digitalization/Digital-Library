import { SubscriptionType } from "../entity/SubscriptionType";
import { Express } from "express"
import { NextFunction, Request, Response } from "express";
import { Subscription } from "../entity/Subscription";
import { BookCheckout } from "../entity/BookCheckout";
export default class BookCheckoutController {
    constructor(
        subscriptionID : number,
        listOfBooksById : number[] ){
            
            this.subscriptionID = subscriptionID;
            this.listOfBooksById = listOfBooksById;
           
    }
    listOfBooksById : number[];
   
    maxOfBook : number ; 
    dateVerification: Date = new Date();
    startingDate = new Date();
    submitDate= new Date();
    subscriptionID : number ;
    numberOfBookThisMonth : number ;
    static actualDate : Date ;
    SetTheOrderOfBook = ( subscriptionId : number ) => {
        for (let i=0 ; i < this.listOfBooksById.length  ; i++ ){
            if(this.listOfBooksById[i] ) {
                this.listOfBooksById[i]= this.listOfBooksById[i];
            }
        }
    }

  private CheckoutIfSubmitIsFinished =  (dateToCompare: Date , subscription : number  ) : boolean =>{
    // verifier si la subscription ayant cette id existe dans la table

    return (this.dateVerification < dateToCompare  ) ? false : true;
}

    private validateTheOrderByBookRead = (numberOfBook : number , subscription : number) :boolean => {
        for (let i = 0; i < numberOfBook; i++) {

        }
        return (this.maxOfBook <= numberOfBook ) ? false :true;
}

   
   
   
   
validateTheOrderOfBook = async ( req : Request, res : Response, next : NextFunction )  => {
    const permissionByCheckBookRead = this.validateTheOrderByBookRead (
        this.numberOfBookThisMonth , 
        this.subscriptionID );
    const permissionByCheckSubmit = this.CheckoutIfSubmitIsFinished (
        BookCheckoutController.actualDate , 
        this.subscriptionID ) ;
    //actualDate =daty androany 
        try {
            
            if (permissionByCheckSubmit && permissionByCheckBookRead ) {
                res.status(200).send(" The order has been received");
                return true; 
                
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



