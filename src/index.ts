#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
const fs = require('fs');
const xml2json = require('xml2json');
const fileMask = /(class|interface)_(.*)\.xml/gm;
const ejs = require('ejs');


clear();
program
    .version('0.0.1')
    .description("Converts Doxygen XML to MD files.")
    .option('-d, --doxygen <type>', '')
    .option('-t, --templates <type>', '')
    .option('-o, --output <type>', '')
    .parse(process.argv);

if (program.doxygen && program.templates && program.output) {
    // path.isAbsolute
    fs.readdir(program.doxygen, (err: Error, filesPaths: Array<string>) => {
        filesPaths.forEach((fileName) => {
            let match = fileMask.exec(fileName);
            if (match) {
                fs.readFile(program.doxygen + '/' + fileName, 'utf8', (err: Error, data: string) => {
                    let obj = xml2json.toJson(data, {object: true});
                    let compound = obj.doxygen.compounddef;
                    let templatePath = path.resolve(program.templates, `${match![1]}.md`);
                    ejs.renderFile(templatePath, {
                        compound: compound,
                        formatArgs: formatArgs
                    }, null, (err: Error, rendered: string) => {
                        if(err) throw err;

                        let outputPath = path.resolve(program.output, `${compound.id}.md`);
                        console.log(outputPath);
                        fs.writeFile(outputPath, rendered, function(err: Error) {
                            if (err) throw err;
                        });
                    });
                });
            }
        })
    });
}

console.log(chalk.red(figlet.textSync('DX=>MD', {horizontalLayout: 'full'})));
// fs.readFile(file, 'utf8', (err, data) => {
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

interface IArgsFormat {
    type: string,
    declname: string
}

function formatArgs(args: IArgsFormat | Array<IArgsFormat>) : string {
    let result;

    if (Array.isArray(args)) {
        result = args.map(formatArgs).join(', ');
    } else {
        result = args.type + ' ' + args.declname;
    }

    return result;
}