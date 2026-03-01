 import { IquearyInput, IquearyParams, PrismaModelDelegate, PrismmaCountManyargument, PrismmaFindManyargument } from "../interfaces/QuieryBuilder.interface"

 
// t = model name
export class QueryBuilder<
T,
TWhereInput = Record<string,unknown>,
TInclude = Record<string,unknown>
>{
    private query : PrismmaFindManyargument;
    private countquery :PrismmaCountManyargument;
    private page : number=1;
    private limit : number=10;
    private skip : number=0;
    private sortby :string = "createdAt";
    private sortorder :  "asc" | "desc"="asc"; 
    private selectFields :Record<string,undefined |boolean>;

    constructor(
        private model:PrismaModelDelegate,
        private queryParams :IquearyParams,
        private config : IquearyInput, 
    ){
        this.query={
            where:{},
            inlcude:{},
            orderBy:{},
            skip:0,
            take:10,
        };
        this.countquery={
            where:{},
        }
    }
    
}