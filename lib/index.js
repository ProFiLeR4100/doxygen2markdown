#!/usr/bin/env node
"use strict";
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var pjson = require('../package.json');
var path = require('path');
var program = require('commander');
var fs = require('fs');
var xml2json = require('xml2json');
var ejs = require('ejs');
clear();
program
    .version(pjson.version)
    .description(pjson.description)
    .usage('[options]')
    .option('-d, --doxygen <path>', 'Doxygen XML output directory.')
    .option('-o, --output <path>', 'Converter output directory.')
    .option('-t, --templates <path>', 'Custom templates directory. (optional)')
    .parse(process.argv);
console.log(chalk.red(figlet.textSync('DX=>MD', { horizontalLayout: 'full' })));
if (program.doxygen && program.output) {
    program.doxygen = path.resolve(program.doxygen);
    program.output = path.resolve(program.output);
    program.templates = program.templates ? path.resolve(program.templates) : path.resolve(__dirname, '../templates');
    fs.readdir(program.doxygen, function (err, filesPaths) {
        filesPaths.forEach(function (fileName) {
            var fileMask = /(class|interface)_(.*)\.xml/gm;
            var match = fileMask.exec(fileName);
            if (match) {
                fs.readFile(program.doxygen + '/' + fileName, 'utf8', function (err, data) {
                    var obj = xml2json.toJson(data, { object: true });
                    var compound = obj.doxygen.compounddef;
                    var templatePath = path.resolve(program.templates, match[1] + ".md");
                    var convertedCompound = Converter.ConvertAll(compound);
                    ejs.renderFile(templatePath, {
                        compound: compound,
                        cc: convertedCompound
                    }, null, function (err, rendered) {
                        if (err)
                            throw err;
                        var outputPath = path.resolve(program.output, compound.id + ".md");
                        fs.writeFile(outputPath, rendered, function (err) {
                            if (err)
                                throw err;
                        });
                    });
                });
            }
        });
    });
}
var Converter = /** @class */ (function () {
    function Converter() {
    }
    Converter.ConvertAll = function (compound) {
        return {
            hierarchy: Converter.ConvertHierarchy(compound),
            summary: Converter.ConvertSummary(compound),
            properties: Converter.ConvertProperties(compound),
            functions: Converter.ConvertFunctions(compound),
            attributes: Converter.ConvertAttributes(compound)
        };
    };
    Converter.ConvertHierarchy = function (compound) {
        var _a, _b;
        var result = [];
        if (Array.isArray(compound.basecompoundref)) {
            result.push.apply(result, compound.basecompoundref.map(function (basecompoundref) { return basecompoundref.prot + " " + basecompoundref.$t; }));
        }
        else if ((_b = (_a = compound) === null || _a === void 0 ? void 0 : _a.basecompoundref) === null || _b === void 0 ? void 0 : _b.prot) {
            result.push(compound.basecompoundref.prot + " " + compound.basecompoundref.$t);
        }
        return result;
    };
    Converter.ConvertProperties = function (compound) {
        return [];
    };
    Converter.ConvertSummary = function (compound) {
        var result = [];
        Array.isArray(compound.sectiondef) && compound.sectiondef.forEach(function (sectiondef) {
            Array.isArray(sectiondef.memberdef) && sectiondef.memberdef.forEach(function (memberdef) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                var typeDef = '';
                typeDef += memberdef.kind == 'property' ? 'property ' : '';
                typeDef += memberdef.prot + " ";
                typeDef += memberdef.static == 'yes' ? 'static ' : '';
                typeDef += memberdef.const == 'yes' ? 'const ' : '';
                typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
                typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
                result.push({
                    typeDef: typeDef,
                    name: memberdef.name,
                    anchor: memberdef.id,
                    anchoredName: "[" + ((_a = memberdef) === null || _a === void 0 ? void 0 : _a.name) + "](#" + ((_b = memberdef) === null || _b === void 0 ? void 0 : _b.id) + ")",
                    type: !!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type,
                    typeRef: (_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.ref,
                    anchoredTypeRef: ((_g = (_f = (_e = memberdef) === null || _e === void 0 ? void 0 : _e.type) === null || _f === void 0 ? void 0 : _f.ref) === null || _g === void 0 ? void 0 : _g.kindref) == "compound" ? "[" + (!!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type) + "](" + ((_k = (_j = (_h = memberdef) === null || _h === void 0 ? void 0 : _h.type) === null || _j === void 0 ? void 0 : _j.ref) === null || _k === void 0 ? void 0 : _k.refid) + ".md#" + ((_o = (_m = (_l = memberdef) === null || _l === void 0 ? void 0 : _l.type) === null || _m === void 0 ? void 0 : _m.ref) === null || _o === void 0 ? void 0 : _o.$t) + ")" : "#" + ((_r = (_q = (_p = memberdef) === null || _p === void 0 ? void 0 : _p.type) === null || _q === void 0 ? void 0 : _q.ref) === null || _r === void 0 ? void 0 : _r.$t),
                    args: memberdef.kind === 'function' ? memberdef.argsstring : '',
                    description: (_t = (_s = memberdef) === null || _s === void 0 ? void 0 : _s.briefdescription) === null || _t === void 0 ? void 0 : _t.para,
                });
            });
        });
        return result;
    };
    Converter.ConvertFunctions = function (compound) {
        return [];
    };
    Converter.ConvertAttributes = function (compound) {
        return [];
    };
    return Converter;
}());
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
