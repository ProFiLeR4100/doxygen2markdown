#!/usr/bin/env node

import {Converter} from "./converter";

const chalk = require('chalk');
const figlet = require('figlet');
const pjson = require('../package.json');
const path = require('path');
const program = require('commander');
const fs = require('fs');
const xml2json = require('xml2json');
const ejs = require('ejs');

polyfills();

program
	.version(pjson.version)
	.description(pjson.description)
	.usage('[options]')
	.option('-d, --doxygen <path>', 'Doxygen XML output directory.')
	.option('-o, --output <path>', 'Converter output directory.')
	.option('-t, --templates <path>', 'Custom templates directory. (optional)')
	.option('-v, --verbose', 'Outputs every filename that was converted. (optional)', false)
	.option('-q, --quiet', 'Completely disables output. (optional)', false)
	.parse(process.argv);

!program.quiet && console.log(chalk.red(figlet.textSync('DX=>MD', {horizontalLayout: 'full'})));
if (program.doxygen && program.output) {
	program.doxygen = path.resolve(program.doxygen);
	program.output = path.resolve(program.output);
	program.templates = program.templates ? path.resolve(program.templates) : path.resolve(__dirname, '../templates');

	fs.readdir(program.doxygen, (err: Error, filesPaths: Array<string>) => {
		filesPaths.forEach((fileName) => {
			let fileMask = /(class|interface|struct)_(.*)\.xml/gm;
			let match = fileMask.exec(fileName);
			if (match) {
				fs.readFile(program.doxygen + '/' + fileName, 'utf8', (err: Error, data: string) => {
					let obj = xml2json.toJson(data, {object: true});
					let compound = obj.doxygen.compounddef;
					let templatePath = path.resolve(program.templates, `${match![1]}.md`);
					let convertedCompound = Converter.ConvertAll(compound);

					ejs.renderFile(templatePath, {
						compound: compound,
						cc: convertedCompound
					}, null, (err: Error, rendered: string) => {
						if (err) throw err;

						let outputFileName = `${compound.id}.md`;
						let outputPath = path.resolve(program.output, outputFileName);
						fs.writeFile(outputPath, rendered, function (err: Error) {
							if (err) throw err;
							!program.quiet && console.log(`Converted ${chalk.yellow(fileName)} => ${chalk.green(outputFileName)}`);
						});
					});
				});
			}
		})
	});
}





if (!process.argv.slice(2).length) {
	program.outputHelp();
}


function polyfills() {
	Object.defineProperty(Array.prototype, 'flat', {
		value: function(depth: number = 1) {
			return this.reduce(function (flat: Array<any>, toFlatten:Array<any>) {
				// @ts-ignore
				return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
			}, []);
		}
	});
}