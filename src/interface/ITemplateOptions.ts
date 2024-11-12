import IBaseOptions from "./IBaseOptions";
import IElementOptions from "../elements/interface/IElementOptions";
import Element from "../elements/Element";

export default interface ITemplateOptions extends IBaseOptions {
    children?: (Element | IElementOptions)[];  //模板子节点
}
