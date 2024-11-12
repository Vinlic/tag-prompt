import ICompilerOptions from "./lib/interface/ICompilerOptions";
import { Element, Block, Raw } from "./elements";
import util from "./lib/util";

export default class ElementFactory {

    static createElement(data: any, compilerOptions?: ICompilerOptions): Element {
        if(Element.isInstance(data)) return data;
        if(util.isString(data))  //纯文本添加为Raw节点
            data = { type: Raw.type, value: data.replace(/^&nbsp;|&nbsp;$/g, " ") };
        if (!util.isObject(data)) throw new TypeError('data must be an Object');
        return new (({
            [Element.Type.Block]: Block,
            [Element.Type.Raw]: Raw
        } as any)[(data as any).type] || Element)(data, compilerOptions);
    }

}