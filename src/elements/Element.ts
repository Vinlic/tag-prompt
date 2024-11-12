import IElementOptions from './interface/IElementOptions';
import IRenderOptions from "../interface/IRenderOptions";
import ICompilerOptions from '../lib/interface/ICompilerOptions';
import ElementFactory from '../ElementFactory';
import ElementTypes from '../enums/ElementTypes';
import Template from '../Template';
import Base from '../Base';
import parser from '../lib/parser';
import util from '../lib/util';

export default class Element extends Base {

    static Type = ElementTypes;
    static type = ElementTypes.Element;
    type = ElementTypes.Element;
    content?: string;  //元素内容
    value?: string;  //元素值
    children?: Element[] = [];  //元素子节点
    #parent?: Template | Element;  //父级节点

    constructor(options: IElementOptions, compilerOptions?: ICompilerOptions) {
        super(options, compilerOptions);
        const { type, children, content, value, ...attrs } = this.optionsCompile(options);
        this.type = type as ElementTypes;
        this.content = content;
        this.value = value;
        this.children = (children || []).map((options: any) => {
            const node = ElementFactory.createElement(options, compilerOptions);
            node.parent = this;
            return node;
        });
        Object.assign(this, attrs);
    }
    
    appendChild(node: any) {
        this.children?.push(this.createNode(node));
    }
    
    createNode(node: any): Element {
        if (!Element.isInstance(node))
            node = ElementFactory.createElement(node, this.compilerOptions);
        node.parent = this;
        return node;
    }

    render(options: IRenderOptions = {}, parent?: any) {
        let tag: any;
        if (!parent)
            tag = this.createRootTag(this.type);
        else
            tag = parent.ele(this.type);
        const _options = this.optionsExport();
        for (let key in _options)
            tag.att(key, _options[key]);
        this.content && tag.txt(this.content);
        this.children?.forEach(node => node.render(options, tag));
        if (!parent)
            return tag.end({
                prettyPrint: options.pretty,
                headless: true
            });
    }

    toBASE64(options: IRenderOptions = {}) {
        return util.encodeBASE64(this.render(options));
    }

    clone() {
        const element = ElementFactory.createElement(util.omit(this, ["children"]));
        element.children = this.children?.map(node => {
            const _node = node.clone();
            _node.parent = element;
            return _node;
        }) || [];
        return element;
    }

    getText(filter?: any): string {
        return this.children?.reduce((t, e) => t + e.getText(filter), this.content || this.value || "") as string;
    }

    findOne(key: string): Element | null {
        for (let node of this.children || []) {
            if (node.type === key)
                return node;
            const foundNode = node.findOne(key);
            if (foundNode) return foundNode;
        }
        return null;
    }

    find(callback: Function): Element | null {
        for (let node of this.children || []) {
            if (callback(node))
                return node;
            const foundNode = node.find(callback);
            if(foundNode) return foundNode;
        }
        return null;
    }

    /**
     * 生成特征字符串
     */
    generateCharacteristicString(excludeAttrNames?: string[], excludeElementTypes?: string[]): string {
        const head = this.generateHeadCharacteristicString(excludeAttrNames);
        return this.children?.reduce((result, node) => result + 
        ((excludeElementTypes || []).includes(node.type) ? "" : node.generateCharacteristicString(excludeAttrNames, excludeElementTypes)), head) || head;  //生成子元素特征字符串并拼接到尾部 
    }

    /**
     * 生成头部特征字符串
     */
    generateHeadCharacteristicString(excludeAttrNames?: string[]): string {
        const options = this.optionsExport(excludeAttrNames);  //提取options并忽略ID（ID经常变动但内容可能不变）
        options.type = this.type;
        const keys = Object.keys(options).sort();  //对options属性进行字典排序
        const head = keys.reduce((result, key) => options[key] ? (result + `${key}${options[key]}`) : result, "");  //将数据进行拼接生成头部部分
        return head;
    }

    /**
     * 导出元素所有元素
     */
    exportElements(options: any = {}) {
        let elements: Element[] = [];
        this.children?.forEach(node => {
            if(!Element.isInstance(node)) return;
            if(options.filter && !options.filter[node.type]) return;
            elements.push(node);
            elements = elements.concat(node.exportElements(options));
        });
        return elements;
    }

    static create(value: any, compilerOptions?: ICompilerOptions) {
        return Element.isInstance(value) ? value : ElementFactory.createElement(value, compilerOptions);
    }

    static isInstance(value: any) {
        return value instanceof Element;
    }

    static parse = parser.parseToElement.bind(parser);

    /**
     * 获取场景所有元素
     */
    get elements() {
        return this.children || [];
    }

    set parent(node: Template | Element | undefined) {
        this.#parent = node;
    }

    get parent() {
        return this.#parent;
    }

    get parentTemplate(): Template | null {
        const parent = this.parent;
        if(!parent)
            return null;
        if(Template.isInstance(parent))
            return parent as Template;
        return (parent as Element).parentTemplate;
    }

}
