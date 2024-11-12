import IBaseOptions from "../../interface/IBaseOptions";
import Element from "../Element";

export default interface IElementOptions extends IBaseOptions {
    type?: string;  //元素类型
    id?: string;  //元素ID
    content?: string;  //元素内容
    value?: string;  //元素值
    children?: (Element | IElementOptions)[];  //元素子节点
};
