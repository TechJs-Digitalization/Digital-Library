import {File} from 'formidable';
declare global{
    namespace Express{
        export interface Request{
            files: { [keys: string] : File[] };
            fields: { [keys: string] : string[] };
        }
    }
}