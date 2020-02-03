#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var converter_1 = require("./converter");
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var pjson = require('../package.json');
var path = require('path');
var program = require('commander');
var fs = require('fs');
var xml2json = require('xml2json');
var ejs = require('ejs');
polyfills();
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
            var fileMask = /(class|interface|struct)_(.*)\.xml/gm;
            var match = fileMask.exec(fileName);
            if (match) {
                fs.readFile(program.doxygen + '/' + fileName, 'utf8', function (err, data) {
                    var obj = xml2json.toJson(data, { object: true });
                    var compound = obj.doxygen.compounddef;
                    var templatePath = path.resolve(program.templates, match[1] + ".md");
                    var convertedCompound = converter_1.Converter.ConvertAll(compound);
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
if (!process.argv.slice(2).length) {
    program.outputHelp();
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
