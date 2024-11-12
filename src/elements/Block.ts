import ICompilerOptions from '../lib/interface/ICompilerOptions';
import IBlockOptions from './interface/IBlockOptions';
import Element from './Element';

export default class Block extends Element {

    static type = Element.Type.Block;
    type = Element.Type.Block;

    constructor(options: IBlockOptions, compilerOptions?: ICompilerOptions) {
        super(options, compilerOptions);
        this.optionsInject(options, {}, {});
    }

    render(options: any, parent?: any) {
        this.children?.forEach(node => node.render(undefined, parent));
    }

    static isInstance(value: any) {
        return value instanceof Block;
    }

}
