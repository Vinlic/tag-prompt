import ICompilerOptions from './interface/ICompilerOptions';
import Source from '../components/Source';
import parser from './parser';

interface LoaderOptions {
    debug?: boolean;
}

interface LoadDatasetOptions {
    race?: boolean,  //是否竞争加载
    timeout?: number  //加载超时时间
}

export default class Loader {

    source: any = {};  //来源对象
    loadingErrors: any[] = [];  //加载中错误数组
    documentRoot: any;  //解析后的文档根，用于复用
    documentScript?: string;  //解析后的文档扩展脚本，用于复用
    debug = false;  //是否开启调试模式

    constructor(options: LoaderOptions = {}) {
        this.debug = options.debug || false;
    }

    parseSource(value: any, compilerOptions?: ICompilerOptions) {
        const { root, scripts } = parser.parseToXMLDocument(value);
        this.documentRoot = root;
        scripts && scripts.length && (this.documentScript = scripts.join(";"));
        let sourceObject;
        for (let o of this.documentRoot.children) {
            if (o.name === "source")
                sourceObject = o;
            if (o.name === "data" && o.attribs && o.attribs.source)  //兼容旧声明
                sourceObject = { children: [{ type: "tag", name: "default", method: "get", children: [{ data: o.attribs.source }] }] };
        }
        if (!sourceObject) return this;
        const source: any = {};
        for (let o of sourceObject.children) {
            if (o.type === "tag") {
                source[o.name] = new Source({
                    name: o.name,
                    ...(sourceObject.attribs || {}),
                    ...(o.attribs || {}),
                    url: o.children.reduce((t: any, v: any) => t + v.data || "", "")
                }, compilerOptions);
            }
        }
        this.source = source;
        return this;
    }

    async loadDataset(processor: Function, options?: LoadDatasetOptions, sourceIndex = 0) {
        return new Promise((resolve, reject) => {
            try {
                const { race = false } = options || {};
                const keys = Object.keys(this.source);
                if (!keys.length) return resolve(null);
                if (race) {
                    let rejectCount = 0;
                    for (let key of keys) {
                        processor(this.source[key])
                            .then(resolve)
                            .catch((err: any) => {
                                this.debug && console.error("dataset source loading error:", err);
                                this.loadingErrors.push(err);
                                rejectCount++;
                                if (rejectCount >= keys.length) {
                                    const errorMessage = this.loadingErrors.reduce((message, err) => message + (err.stack || "unknown error"), "");
                                    reject(new Error(`dataset loading failed: ${errorMessage}`));
                                }
                            });
                    }
                }
                else {
                    const source = this.source[keys[sourceIndex]];
                    if (!source) {
                        const errorMessage = this.loadingErrors.reduce((message, err) => message + (err.stack || "unknown error"), "");
                        throw new Error(`dataset loading failed: ${errorMessage}`);
                    }
                    processor(source)
                        .then(resolve)
                        .catch((err: any) => {
                            this.debug && console.error(`dataset source ${source.name} loading error: `, err);
                            this.loadingErrors.push(err);
                            this.loadDataset(processor, options, sourceIndex + 1)
                                .then(resolve)
                                .catch(reject);
                        });
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }

    get docmentScript() {
        return this.documentScript;
    }

}
