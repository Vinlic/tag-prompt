export default interface IBaseOptions {
    other?: any;  //元素数据对象
    for?: string;  //元素循环关键字for
    if?: boolean | string;  //元素条件分歧关键字if
    else?: boolean | string;  //元素条件分歧关键字else
    elif?: boolean | string;  //元素条件分歧关键字elif
    debug?: boolean | string;  //是否为调试模式
}
