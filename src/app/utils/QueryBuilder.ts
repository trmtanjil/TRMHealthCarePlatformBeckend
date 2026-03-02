 import { IquearyInput, IquearyParams, PrismaModelDelegate, PrismaWhereConditions, PrismmaCountManyargument, PrismmaFindManyargument, PrsmaStringFilter } from "../interfaces/QuieryBuilder.interface"

 
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
    search():this{
        const {searchTerm} = this.queryParams;
        const {searchebleFeilds}=this.config;

        if(searchTerm && searchebleFeilds && searchebleFeilds.length>0){
            const searchCondition :Record<string,unknown> []=
            searchebleFeilds.map((field)=>{
                if(field.includes("." )){
                    const parts = field.split(".");

                    if(parts.length ===2){
                        const [relation, nestedField] = parts;

                        const stringFilter :PrsmaStringFilter={
                            contains:searchTerm,
                            mode:"insensitive" as const,
                        }

                        return {
                            [relation]:{
                                [nestedField]:stringFilter,
                            }
                        }
                    }else if(parts.length ===3){
                          const [relation, nestedRelation, nestedField] = parts;

                          const stringFilter :PrsmaStringFilter={
                            contains:searchTerm,
                            mode:"insensitive" as const,
                          }

                          return {
                            [relation]:{
                                [nestedRelation]:{
                                    [nestedField]:stringFilter,
                                }
                            }
                          }
                    }

            } 
            const stringFilter :PrsmaStringFilter={
                contains:searchTerm,
                mode:"insensitive" as const,
            }
            return {
                [field]:stringFilter,
            }

            }
     );
            const whereCondition =this.query.where as PrismaWhereConditions
            whereCondition.OR = searchCondition;

            const coundWhereCondition =this.countquery.where as PrismaWhereConditions
            coundWhereCondition.OR = searchCondition;
        }
        return this;

    }
    
}