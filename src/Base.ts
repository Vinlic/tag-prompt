import { create } from 'xmlbuilder2';

import IBaseOptions from './interface/IBaseOptions';
import ICompilerOptions from './lib/interface/ICompilerOptions';
import Compiler from './lib/Compiler';
import util from './lib/util';

class Base {

    other?: any;  //元素数据对象
    for?: string;  //元素循环关键字for
    if?: string;  //元素条件分歧关键字if
    else?: string;  //元素条件分歧关键字else
    elif?: string;  //元素条件分歧关键字elif
    compile: boolean = false;  //是否编译
    debug: boolean = false;  //是否为调试模式
    compilerOptions: ICompilerOptions = {};  //编译器选项

    constructor(options?: IBaseOptions, compilerOptions?: ICompilerOptions) {
        if (!options) return;
        this.optionsInject(options, {
            if: (v: any) => util.isUndefined(v) ? v : (v + ""),
            elif: (v: any) => util.isUndefined(v) ? v : (v + ""),
            else: (v: any) => util.isUndefined(v) ? v : (v + ""),
            compile: (v: any) => util.booleanParse(util.defaultTo(v, false)),
            debug: (v: any) => util.booleanParse(util.defaultTo(v, false))
        }, {
            compile: util.isBoolean,
            debug: util.isBoolean,
            other: util.isObject,
            for: util.isString,
            if: util.isString,
            elif: util.isString,
            else: util.isString
        });
        this.compilerOptions = { ...compilerOptions, debug: this.debug };
    }

    optionsCompile(options: any) {
        return new Compiler(this.compilerOptions).compile(options);
    }

    optionsInject(options: any = {}, initializers: any = {}, checkers: any = {}) {
        if (util.isArray(options))  //如果options为数组则制取首个
            options = options[0];
        const that = this as any;
        Object.keys(that).forEach(key => {
            if (/^_/.test(key) && !/^__/.test(key)) return;
            let value = options[key];
            if (util.isFunction(initializers[key])) value = initializers[key](value);
            if (util.isFunction(checkers[key]) && !checkers[key](value)) {
                if (util.isUndefined(that[key]) && util.isUndefined(options[key])) return;
                console.warn("invalid options:", options);
                throw new Error(`parameter ${key} invalid`);
            };
            if ((!util.isFunction(initializers[key]) && !util.isFunction(checkers[key])) || util.isUndefined(value)) return;
            that[key] = value;
        });
    }

    optionsExport(_excludeAttrNames?: string[]) {
        const excludeAttrNames = ["children", "ref", "content", "compile", "debug", "compilerOptions", ...(_excludeAttrNames || [])];
        const options: any = {};
        for (let key in this) {
            if (key === "type" || excludeAttrNames.indexOf(key) !== -1 || /^_[^_]/.test(key))
                continue;
            options[key === "__type" ? "type" : key] = (function handle(value: any) {
                if (util.isObject(value)) {
                    for (let _key in value) {
                        if (excludeAttrNames.indexOf(_key) !== -1)
                            continue;
                        options[`${key}-${_key}`] = handle((value as any)[_key]);
                    }
                }
                else
                    return value;
            }).bind(this)(this[key]);
        }
        return options;
    }

    update(value: any = {}) {
        util.merge(this, value);
    }

    createRootTag(name: string, attrs?: any) {
        return create().ele(name, attrs);
    }

    toJSON() {
        return util.omit(this, ["compile", "debug", "compilerOptions"]);
    }

}

export default Base;
