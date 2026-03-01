
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