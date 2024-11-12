import { parseDocument } from 'htmlparser2';

import ICompilerOptions from './interface/ICompilerOptions';
import Template from '../Template';
import ElementFactory from '../ElementFactory';
import ElementTypes from '../enums/ElementTypes';
import Compiler from './Compiler';
import util from './util';

const PARSER_OPTIONS = { xmlMode: true };
const ELEMNET_TYPES = Object.values(ElementTypes);

export default {

    parseToTemplate(value: any, compilerOptions?: ICompilerOptions) {
        const { root, scripts } = this.parseToXMLDocument(value);
        let templateObject, datasetObject;
        for (let o of root.children) {
            if (o.name === "data")
                datasetObject = o;
            else if (o.name !== "script")
                templateObject = o;
        }
        if (!templateObject)
            throw new Error("template tag not found");
        const template = this.parseAttributes(templateObject.attribs);
        template.children = [];
        if (!compilerOptions) compilerOptions = {};
        if(datasetObject) {
            const dataset = this.convertDatasetObject(datasetObject);
            if(util.isObject(dataset))
                compilerOptions.dataset = Object.assign(compilerOptions.dataset || {}, dataset)
        }
        scripts.length && (compilerOptions.script = scripts.join(";"));
        for (let o of templateObject.children) {
            if (o.name)
                template.children.push(this.parseToElement(o, compilerOptions));
            else if (o.type === "text" && o.data) {
                const text = o.data.trim();
                if (!text.length) continue;
                template.children.push({
                    type: "raw",
                    value: text,
                    ...o.attribs
                });
            }
        }
        return new Template(template, compilerOptions);
    },

    parseToElement(value: any, compilerOptions?: ICompilerOptions) {
        const { root, scripts } = this.parseToXMLDocument(value);
        let elementObject, datasetObject;
        for (let o of root.children) {
            if (o.name)
                elementObject = o;
            else if (o.name === "data")
                datasetObject = o;
        }
        if (!elementObject)
            throw new Error("element tag not found");
        const element = {
            type: elementObject.name,
            ...this.parseAttributes(elementObject.attribs, { objectParse: ELEMNET_TYPES.indexOf(elementObject.name) !== -1 }),
            children: []
        };
        if (!compilerOptions) compilerOptions = {};
        if(datasetObject) {
            const dataset = this.convertDatasetObject(datasetObject);
            if(util.isObject(dataset))
                compilerOptions.dataset = Object.assign(compilerOptions.dataset || {}, dataset)
        }
        scripts.length && (compilerOptions.script = scripts.join(";"));
        for (let o of elementObject.children) {
            if (o.name)
                element.children.push(this.parseToElement(o, compilerOptions));
            else if (o.type === "text" && o.data) {
                const text = o.data.trim();
                if (!text.length) continue;
                element.children.push({
                    type: "raw",
                    value: text,
                    ...o.attribs
                });
            }
        }
        return util.isString(value) ? ElementFactory.createElement(element, compilerOptions) : element;
    },

    convertDatasetObject(datasetObject: any) {
        const convert = (obj: any): any => {
            const target: any = {};
            if (obj.type === "tag") {
                const texts: string[] = [];
                obj?.children?.forEach((node: any) => {
                    if (node.type === "tag")
                        target[node.name] = convert(node);
                    else if (node.type === "text")
                        texts.push(node.data || "");
                });
                if (texts.length === (obj?.children?.length || 0))
                    return texts.join("");
            }
            return target;
        };
        return convert(datasetObject);
    },

    parseAttributes(value: any, options?: { objectParse?: boolean, booleanParse?: boolean }) {
        const { objectParse = true, booleanParse } = options || {};
        const attributes: any = {};
        for (let key in value) {
            const index = key.indexOf("-");
            if (objectParse && index !== -1) {
                const oKey = key.substring(0, index);
                const vkey = key.substring(index + 1);
                if (!attributes[oKey])
                    attributes[oKey] = {};
                attributes[oKey][vkey] = booleanParse && value[key] === "" ? true : value[key];
            }
            else
                attributes[key === "type" ? "__type" : key] = (booleanParse || key === "else") && value[key] === "" ? true : value[key];
        }
        return attributes;
    },

    prepareXMLContent(content) {
        const scripts: any = [];
        content = content.trim();
        if(content.indexOf("<script>") !== -1) {
            const regExp = /<script>([\s\S]*?)<\/script>/gm;
            let match;
            while((match = regExp.exec(content)) !== null) {
                if(!match[1]) continue;
                scripts.push(match[1]);
            }
            content = content.replace(regExp, "");
        }
        return {
            scripts,
            content
        };
    },

    parseToXMLDocument(value: any) {
        let root, scripts: string[] = [];
        if (util.isString(value)) {
            const { scripts: _scripts, content } = this.prepareXMLContent(value);
            scripts = _scripts;
            root = parseDocument(content, PARSER_OPTIONS);
            root = root.children.find(v => v.type === "tag" && v.name === "root") || root;
        }
        else if (value && value.type !== "root" && value.name !== "root")
            root = { children: [value] };
        else
            root = value;
        return { root, scripts };
    }

};
