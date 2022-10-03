import {Files, Fields} from 'formidable';
declare namespace Express{
    export interface Request {
        files?: Files;
        fields?: Fields;
    }
}