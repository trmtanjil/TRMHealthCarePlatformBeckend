/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PrismmaFindManyargument{
    where?:Record<string,unknown>;
    orderBy?:Record<string,unknown>;
   select?:Record<string,unknown>;
   oderby?:Record<string,unknown> | Record<string,unknown>[];
   skip?:number;
   take?:number;
   cursor  ?:Record<string,unknown>;
   distinct?:string[] | string;
   [key:string]:unknown;
}
export interface PrismmaCountManyargument{
    where?:Record<string,unknown>;
    orderBy?:Record<string,unknown>;
   select?:Record<string,unknown>;
   oderby?:Record<string,unknown> | Record<string,unknown>[];
   skip?:number;
   take?:number;
   cursor  ?:Record<string,unknown>;
   distinct?:string[] | string;
   [key:string]:unknown;
}

export interface PrismaModelDelegate {
    findmany(arg ?:any):Promise<unknown[]>;
    count(arg ?:any):Promise<number>;
}

export interface IquearyParams {
    searchTerm ?:string;
    page?:string;
    limit?:string;
    sortby?:string;
    sortorder?:string;
    keilds?:string;
    feilds?:string;
    include?:string;
    [key:string]:string |undefined;

}
export interface IquearyInput {
    searchebleFeilds ?:string[];
    feilterableFeilds ?:string[];
}