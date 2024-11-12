import _ from 'lodash';

import type ITemplateOptions from "./interface/ITemplateOptions";
import type ICompilerOptions from './lib/interface/ICompilerOptions';
import type IRenderOptions from './interface/IRenderOptions';
import Base from "./Base";
import ElementFactory from "./ElementFactory";
import Element from './elements/Element';
import Block from "./elements/Block";
import parser from './lib/parser';
import util from './lib/util';

export default class Template extends Base {

    static type = "template";
    readonly type = "template";
    children?: Element[] = [];  //模板子节点

    constructor(options: ITemplateOptions, compilerOptions?: ICompilerOptions) {
        super(options, compilerOptions);
        const { children, ...attrs } = this.optionsCompile(options);
        this.children = (children || [])?.map((options: any) => this.createNode(options)) || [];
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

    getText(filter?: any): string {
        return this.children?.reduce((t, e) => t + e.getText(filter), "") as string;
    }

    render(options: IRenderOptions = {}) {
        const tag = this.createRootTag(Template.type, this.optionsExport());
        this.children?.forEach(node => node.render(undefined, tag));
        return tag.end({
            prettyPrint: options.pretty,
            headless: true
        });
    }

    toBASE64(options?: IRenderOptions) {
        return util.encodeBASE64(this.render(options));
    }

    clone() {
        const template = new Template(_.omit(this, ["children"]) as any);
        let children = this.children || [];
        template.children = [];
        children.forEach(node => {
            const _node = node.clone();
            _node.parent = template;
            template.children?.push(_node);
        });
        return template;
    }

    findOne(key: string) {
        for (let node of this.children || []) {
            if (node.type === key)
                return node;
            const foundNode = node.findOne(key);
            if (foundNode) return foundNode;
        }
        return null;
    }

    find(callback: Function) {
        for (let node of this.children || []) {
            if (callback(node))
                return node;
            const foundNode = node.find(callback);
            if (foundNode) return foundNode;
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
     * 深度提取block中的子元素
     * 
     * @param {Block} block
     */
    extractBlockChildrens(block: Block) {
        return block.children?.reduce((childrens: Element[], node: Element) => {
            if (Block.isInstance(node))
                childrens = childrens.concat(this.extractBlockChildrens(node as Block) as Element[]);
            else
                childrens.push(node)
            return childrens;
        }, []) || [];
    }

    /**
     * 获取模板所有元素
     */
    get elements() {
        return this?.children?.filter(node => Element.isInstance(node)) || [];
    }

    static create(value: any) {
        return Template.isInstance(value) ? value : new Template(value);
    }

    static isInstance(value: any) {
        return value instanceof Template;
    }

    static parse = parser.parseToTemplate.bind(parser);

}
