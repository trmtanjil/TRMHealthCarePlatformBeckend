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
    findMany(arg ?:any):Promise<unknown[]>;
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
    filterableFields ?:string[];
}

export interface PrsmaStringFilter {
    contains?:string;
    startsWith?:string;
    endsWith?:string;
    mode    ?:string;
    equal   ?:string;
    in      ?:string[];
    notIn   ?:string[];
    not     ?:string;
    lt      ?:string;
    lte     ?:string;
    gt      ?:string;
    gte     ?:string;
      
}

export interface PrismaWhereConditions{
    AND?:Record<string,unknown>[];
    OR?:Record<string,unknown>[];
    NOT?:Record<string,unknown>[];
    [key:string]:unknown
}

export interface PrismaNumberFilter{
equal ?:number;
in ?:number[];
notIn ?:number[];
lt ?:number;
lte ?:number;
gt ?:number;
gte ?:number;   
}

export interface PrismaStringFilter{
    contains ?:string;
    startsWith ?:string;
    endsWith ?:string;
    mode    ?:string;
    equal   ?:string;
    in      ?:string[];
    notIn   ?:string[];
    not     ?:string;
    lt      ?:string;
    lte     ?:string;
    gt      ?:string;
    gte     ?:string;
}

export interface IQueryResult<T> {
    data : T[];
    meta : {
        page : number;
        limit : number;
        total : number;
        totalPages : number;
    }
}