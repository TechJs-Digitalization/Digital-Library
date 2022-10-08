import { Subscription } from "../entity/Subscription";
import { SubscriptionType } from "../entity/SubscriptionType";
import SubscriptionController from "./Subscription.controller";

export  class StaticFile {
    static subscription : Subscription ;
    static subsciptiontype : SubscriptionType ;
         
    static subscriptionController = new SubscriptionController(
        StaticFile.subscription , 
        5);
    
    static actualDate : Date = new Date();
  
    }