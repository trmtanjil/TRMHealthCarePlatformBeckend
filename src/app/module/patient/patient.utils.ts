 import { isValid, parse } from "date-fns";


export const convertDateTime =  ( dateString:string |undefined)=>{
if(!dateString) return undefined;

const date = parse(dateString, 'yyyy-MM-dd', new Date());

 
    if(!isValid(date)) return undefined;

    return date;
}