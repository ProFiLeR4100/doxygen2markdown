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
var fileMask = /(class|interface)_(.*)\.xml/gm;
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
            var match = fileMask.exec(fileName);
            if (match) {
                fs.readFile(program.doxygen + '/' + fileName, 'utf8', function (err, data) {
                    var obj = xml2json.toJson(data, { object: true });
                    var compound = obj.doxygen.compounddef;
                    var templatePath = path.resolve(program.templates, match[1] + ".md");
                    ejs.renderFile(templatePath, {
                        compound: compound
                    }, null, function (err, rendered) {
                        if (err)
                            throw err;
                        var outputPath = path.resolve(program.output, compound.id + ".md");
                        console.log('Converted: ', outputPath);
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
