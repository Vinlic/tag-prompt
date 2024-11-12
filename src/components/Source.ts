import ISourceOptions from './interface/ISourceOptions';
import ICompilerOptions from '../lib/interface/ICompilerOptions';
import Base from '../Base';
import util from '../lib/util';

export default class Source extends Base {

    name = '';  //源名称
    method = '';  //请求方法
    url?: string;  //请求URL
    params?: any;  //请求参数

    constructor(options: ISourceOptions, compilerOptions?: ICompilerOptions) {
        super(options, compilerOptions);
        const attrs = this.optionsCompile(options);
        Object.assign(this, attrs);
    }

}
