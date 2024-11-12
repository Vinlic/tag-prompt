import IBaseOptions from "../../interface/IBaseOptions";

export default interface ISourceOptions extends IBaseOptions {
    name?: string;  //源名称
    method?: string;  //请求方法
    url?: string;  //请求URL
    params?: any;  //请求参数
}
