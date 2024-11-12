import ICompilerOptions from '../lib/interface/ICompilerOptions';
import IRawOptions from './interface/IRawOptions';
import Element from './Element';

export default class Raw extends Element {

    static type = Element.Type.Raw;
    type = Element.Type.Raw;

    constructor(options: IRawOptions, compilerOptions?: ICompilerOptions) {
        super(options, compilerOptions);
        this.optionsInject(options, {}, {});
    }

    render(options: any, parent?: any) {
        if(!parent) return this.value || "";
        parent.txt(this.getText().replace(/^\s|\s$/g, "&nbsp;"));
    }

    generateCharacteristicString(excludeAttrNames?: string[], excludeElementTypes?: string[]): string {
        return this.generateHeadCharacteristicString(excludeAttrNames);
    }

    /**
     * 生成头部特征字符串
     */
    generateHeadCharacteristicString(excludeAttrNames?: string[]): string {
        return this.getText();
    }

    getText(filter?: any) {
        if(filter && this.parent && !filter[this.parent.type])
            return "";
        return this.value || "";
    }

    static isInstance(value: any) {
        return value instanceof Raw;
    }

}
