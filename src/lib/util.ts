import lodash from 'lodash';

const util = {

    ...lodash,

    isUnixTimestamp(value: any) {
        return /^[0-9]{10}$/.test(`${value}`);
    },

    isPromise(value: any) {
        return util.isObject(value) && util.isFunction((value as any).then);
    },

    booleanParse(value: any) {
        switch (typeof value) {
            case "string": return ['true', 't', 'yes', 'y', 'on', '1', ''].indexOf(value.trim().toLowerCase()) !== -1;
            case "number": return value.valueOf() === 1;
            case "boolean": return value.valueOf();
        }
    },

    millisecondsToSenconds(value: any, precision: number = 3) {
        if(!util.isFinite(Number(value)))
            return value;
        const multiple = Math.pow(10, precision);
        return Math.floor(Number(value) / 1000 * multiple) / multiple;
    },

    sencondsToMilliseconds(value: any) {
        if(!util.isFinite(Number(value)))
            return value;
        return value * 1000;
    },

    encodeBASE64(value: any) {
        value = util.isString(value) ? value : JSON.stringify(value);
        return typeof Buffer !== "undefined" ? Buffer.from(value).toString("base64") : btoa(unescape(encodeURIComponent(value)));
    },

    decodeBASE64(value: any) {
        if (!util.isString(value))
            throw new TypeError("value must be an string");
        return typeof Buffer !== "undefined" ? Buffer.from(value, "base64").toString() : decodeURIComponent(escape(atob(value)));
    },

    encodeSrc(value: any) {
        return "base64:" + util.encodeBASE64(value);
    },

    decodeSrc(src: string, ignoreParseError = false) {
        try {
            let raw;
            if (/^base64\:/.test(src))
                raw = util.decodeBASE64(src.substring(7));
            else if (/^json\:/.test(src))
                raw = src.substring(5);
            else
                return null;
            const result = util.attempt(() => JSON.parse(raw));
            if(util.isError(result)) {
                if(ignoreParseError)
                    return raw;
                else
                    throw result;
            }
            return result;
        }
        catch (err: any) {
            throw new Error(`src ${src} decode error: ${err.message || "unknown error"}`);
        }
    },

    parseColors(colors) {
        if(!colors) return [];
        try {
            return colors.match(/#[0-9a-zA-Z]+/g) || colors.match(/rgba?\([\d\s\.]+,[\d\s\.]+,[\d\s\.]+(,[\d\s\.]+)?\)/g);
        }
        catch(err) {
            console.error(`colors ${colors} parse error:`, err);
            return [];
        }
    }

};

export default util;
