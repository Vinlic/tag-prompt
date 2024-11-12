import util from "./util";

const functions = {  //扩展函数

    o2j: (v: any) => "json:" + JSON.stringify(v),

    o2b: (v: any) => "base64:" + util.encodeBASE64(v),

    gt: (v1: any, v2: any) => v1 > v2,

    lt: (v1: any, v2: any) => v1 < v2,

    gte: (v1: any, v2: any) => v1 >= v2,
    
    lte: (v1: any, v2: any) => v1 <= v2

} as any;

export default { functions };