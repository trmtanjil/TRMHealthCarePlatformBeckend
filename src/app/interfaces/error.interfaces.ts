export interface TErrorSource{
  path:string;
  message:string;
}

export interface TerrorResponse{
    statusCode?:number;
    success:boolean;
    message:string;
    errorSources:TErrorSource[];
    error?:unknown 
}