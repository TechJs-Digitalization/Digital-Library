import { BookCheckout } from "../entity/BookCheckout";
import BookCheckoutController from "../controllers/BookCheckout.controller"
import { NextFunction } from "express";
import {Request , Response } from "express";
export class  BookCheckoutMiddleware extends BookCheckoutController {
    controller: BookCheckoutController
        validateTheOrderOfBook = async ( req : Request, res : Response, next : NextFunction )  => {
        const permissionByCheckBookRead = this.validateTheOrderByBookRead (
            this.numberOfBookThisMonth , 
            this.subscriptionID );
        const permissionByCheckSubmit = this.checkoutIfSubmitIsFinished (this.actualDate ,this.controller.subscriptionID ) ;
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
 