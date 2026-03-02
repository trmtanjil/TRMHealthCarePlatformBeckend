 import { IquearyInput, IquearyParams, PrismaModelDelegate, PrismaNumberFilter, PrismaStringFilter, PrismaWhereConditions, PrismmaCountManyargument, PrismmaFindManyargument, PrsmaStringFilter } from "../interfaces/QuieryBuilder.interface"

 
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

    filter():this{
        
        const { filterableFields } = this.config;
        const excludedField = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include'];

        const filterParams : Record<string, unknown> = {};

        Object.keys(this.queryParams).forEach((key) => {
            if(!excludedField.includes(key)){
                filterParams[key] = this.queryParams[key];
            }
        })

        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.countquery.where as Record<string, unknown>;

        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];

            if(value === undefined || value === ""){
                return;
            }

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);

            
            // doctorFilterableFields = ['specialties.specialty.title', 'appointmentFee']
            // /doctors?appointmentFee[lt]=100&appointmentFee[gt]=50 => { appointmentFee: { lt: '100', gt: '50' } }

            // /doctors?user.name=John => { user: { name: 'John' } }
            if(key.includes(".")){
                const parts = key.split(".");

                if(filterableFields && !filterableFields.includes(key)){
                    return;
                }



                if(parts.length === 2){
                    const [relation, nestedField] = parts;

                    if(!queryWhere[relation]){
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }

                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    queryRelation[nestedField] = this.parseFilterValue(value);
                    countRelation[nestedField] = this.parseFilterValue(value);
                    return;
                }
                else if(parts.length === 3){
                    const [relation, nestedRelation, nestedField] = parts;

                    if(!queryWhere[relation]){
                        queryWhere[relation] = {
                            some: {}
                        };
                        countQueryWhere[relation] = {
                            some: {}
                        };
                    }
                    
                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    if(!queryRelation.some){
                        queryRelation.some = {};
                    }
                    if(!countRelation.some){
                        countRelation.some = {};
                    }

                    const querySome = queryRelation.some as Record<string, unknown>;
                    const countSome = countRelation.some as Record<string, unknown>;

                    if(!querySome[nestedRelation]){
                        querySome[nestedRelation] = {};
                    }

                    if(!countSome[nestedRelation]){
                        countSome[nestedRelation] = {};
                    }

                    const queryNestedRelation = querySome[nestedRelation] as Record<string, unknown>;
                    const countNestedRelation = countSome[nestedRelation] as Record<string, unknown>;

                    queryNestedRelation[nestedField] = this.parseFilterValue(value);
                    countNestedRelation[nestedField] = this.parseFilterValue(value);

                    return;
                }

            }
            if (!isAllowedField) {
                return;
            }


            // Range filter parsing
            if(typeof value === 'object' && value !== null && !Array.isArray(value)){
                queryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                countQueryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                return;
            }

            //direct value parsing
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        })
        return this;
    }

        paginate() : this {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;

        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;

        this.query.skip = this.skip;
        this.query.take = this.limit;

        return this;
    }

    
    sort () : this {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';

        this.sortby = sortBy;
        this.sortorder = sortOrder;

        // /doctors?sortBy=user.name&sortOrder=asc => orderBy: { user: { name: 'asc' } }

        if(sortBy.includes(".")){
            const parts = sortBy.split(".");

            if(parts.length === 2){
                const [relation, nestedField] = parts;

                this.query.orderBy = {
                    [relation] : {
                        [nestedField] : sortOrder
                    }
                }
            }else if(parts.length === 3){
                const [relation, nestedRelation, nestedField] = parts;

                this.query.orderBy = {
                    [relation] : {
                        [nestedRelation] : {
                            [nestedField] : sortOrder
                        }
                    }
                }
            }else{
                this.query.orderBy = {
                    [sortBy] : sortOrder
                }
            }
        }else{
            this.query.orderBy = {
                [sortBy]: sortOrder
            }
        }
        return this;
    }


     private parseFilterValue(value : unknown) : unknown {

        if(value === 'true'){
            return true;
        }
        if(value === 'false'){
            return false;
        }

        if(typeof value === 'string' && !isNaN(Number(value)) && value != ""){
            return Number(value);
        }

        if(Array.isArray(value)){
            return { in : value.map((item) => this.parseFilterValue(item)) }
        }

        return value;
    }

     private parseRangeFilter(value : Record<string, string | number>) : PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {

        const rangeQuery: Record<string, string | number | (string | number)[] > = {};

        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];


            const parsedValue : string | number = typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;

            switch(operator){
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                    rangeQuery[operator] = parsedValue;
                    break;

                case 'in':
                case 'notIn':
                    if(Array.isArray(operatorValue)){
                        rangeQuery[operator] = operatorValue
                    }else {
                        rangeQuery[operator] = [parsedValue];
                    }
                    break;
                default:
                    break;

            }
        });

        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
    }
}