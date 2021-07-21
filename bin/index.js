#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var converter_1 = require("./converter");
var chalk_1 = __importDefault(require("chalk"));
var figlet_1 = __importDefault(require("figlet"));
var path_1 = __importDefault(require("path"));
var commander_1 = __importDefault(require("commander"));
var fs_1 = __importDefault(require("fs"));
var xml2json_1 = __importDefault(require("xml2json"));
var ejs_1 = __importDefault(require("ejs"));
var pjson = require('../package.json');
polyfills();
commander_1.default
    .version(pjson.version)
    .description(pjson.description)
    .usage('[options]')
    .option('-d, --doxygen <path>', 'Doxygen XML output directory.')
    .option('-o, --output <path>', 'Converter output directory.')
    .option('-t, --templates <path>', 'Custom templates directory. (optional)')
    .option('-v, --verbose', 'Outputs every filename that was converted. (optional)', false)
    .option('-q, --quiet', 'Completely disables output. (optional)', false)
    .parse(process.argv);
!commander_1.default.quiet && console.log(chalk_1.default.red(figlet_1.default.textSync('DX=>MD', { horizontalLayout: 'full' })));
if (commander_1.default.doxygen && commander_1.default.output) {
    commander_1.default.doxygen = path_1.default.resolve(commander_1.default.doxygen);
    commander_1.default.output = path_1.default.resolve(commander_1.default.output);
    commander_1.default.templates = commander_1.default.templates ? path_1.default.resolve(commander_1.default.templates) : path_1.default.resolve(__dirname, '../templates');
    fs_1.default.readdir(commander_1.default.doxygen, function (err, filesPaths) {
        filesPaths.forEach(function (fileName) {
            var fileMask = /(class|interface|struct)_(.*)\.xml/gm;
            var match = fileMask.exec(fileName);
            if (match) {
                fs_1.default.readFile(commander_1.default.doxygen + '/' + fileName, { encoding: 'utf8' }, function (err, doxygenXmlFileContent) {
                    var doxygenConvertedData = xml2json_1.default.toJson(doxygenXmlFileContent, { object: true });
                    var compound = doxygenConvertedData.doxygen.compounddef;
                    var templatePath = path_1.default.resolve(commander_1.default.templates, match[1] + ".md");
                    var convertedCompound = converter_1.Converter.ConvertAll(compound);
                    ejs_1.default.renderFile(templatePath, {
                        compound: compound,
                        cc: convertedCompound
                    }, function (err, rendered) {
                        if (err)
                            throw err;
                        var outputFileName = compound.id + ".md";
                        var outputPath = path_1.default.resolve(commander_1.default.output, outputFileName);
                        fs_1.default.writeFile(outputPath, rendered, function (err) {
                            if (err)
                                throw err;
                            !commander_1.default.quiet && console.log("Converted " + chalk_1.default.yellow(fileName) + " => " + chalk_1.default.green(outputFileName));
                        });
                    });
                });
            }
        });
    });
}
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
function polyfills() {
    Object.defineProperty(Array.prototype, 'flat', {
        value: function (depth) {
            if (depth === void 0) { depth = 1; }
            return this.reduce(function (flat, toFlatten) {
                // @ts-ignore
                return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
            }, []);
        }
    });
}
