#!/usr/bin/env node
declare const chalk: any;
declare const clear: any;
declare const figlet: any;
declare const pjson: any;
declare const path: any;
declare const program: any;
declare const fs: any;
declare const xml2json: any;
declare const ejs: any;
declare class Converter {
    static ConvertAll(compound: any): any;
    static ConvertHierarchy(compound: any): any;
    static ConvertProperties(compound: any): any;
    static ConvertSummary(compound: any): any;
    static ConvertFunctions(compound: any): any;
    static ConvertAttributes(compound: any): any;
}
