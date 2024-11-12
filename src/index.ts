export { version } from '../package.json';  //暴露模块版本

export { default as Template } from './Template';
export { default as Element } from "./elements/Element";
export { default as Raw } from './elements/Raw';
export { default as Loader } from './lib/Loader'; 
export * as elements from './elements';
