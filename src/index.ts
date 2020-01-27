#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const pjson = require('../package.json');
const path = require('path');
const program = require('commander');
const fs = require('fs');
const xml2json = require('xml2json');
const fileMask = /(class|interface)_(.*)\.xml/gm;
const ejs = require('ejs');

clear();
program
	.version(pjson.version)
	.description(pjson.description)
	.usage('[options]')
	.option('-d, --doxygen <path>', 'Doxygen XML output directory.')
	.option('-o, --output <path>', 'Converter output directory.')
	.option('-t, --templates <path>', 'Custom templates directory. (optional)')
	.parse(process.argv);

console.log(chalk.red(figlet.textSync('DX=>MD', {horizontalLayout: 'full'})));
if (program.doxygen && program.output) {
	program.doxygen = path.resolve(program.doxygen);
	program.output = path.resolve(program.output);
	program.templates = program.templates ? path.resolve(program.templates) : path.resolve(__dirname, '../templates');

	fs.readdir(program.doxygen, (err: Error, filesPaths: Array<string>) => {
		filesPaths.forEach((fileName) => {
			let match = fileMask.exec(fileName);
			if (match) {
				fs.readFile(program.doxygen + '/' + fileName, 'utf8', (err: Error, data: string) => {
					let obj = xml2json.toJson(data, {object: true});
					let compound = obj.doxygen.compounddef;
					let templatePath = path.resolve(program.templates, `${match![1]}.md`);
					ejs.renderFile(templatePath, {
						compound: compound
					}, null, (err: Error, rendered: string) => {
						if (err) throw err;

						let outputPath = path.resolve(program.output, `${compound.id}.md`);
						console.log('Converted: ', outputPath);
						fs.writeFile(outputPath, rendered, function (err: Error) {
							if (err) throw err;
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
