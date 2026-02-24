export interface TErrorSource{
  path:string;
  message:string;
}

export interface TerrorResponse{
    statusCode?:number;
    success:boolean;
    message:string;
    stack?:string
    errorSources:TErrorSource[];
    error?:unknown 
}