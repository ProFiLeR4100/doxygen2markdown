#!/usr/bin/env node

import {Converter} from "./converter";
import chalk from 'chalk';
import figlet from 'figlet';
import path from "path";
import program from "commander";
import fs from "fs";
import xml2json from "xml2json";
import ejs from "ejs";
import ErrnoException = NodeJS.ErrnoException;

const pjson = require('../package.json');

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


export interface BaseCompoundRef {
	readonly refid: string;
	readonly prot: string;
	readonly virt: string;
	readonly $t: string;
}

export interface MemberDefDescription {
	readonly para: unknown | unknown[];
}

export interface TypeRef {
	readonly $t: string;
}

export interface TypeDef {
	readonly ref: TypeRef;
}

export interface MemberDef {
	readonly name: string;
	readonly id: string;
	readonly type: TypeDef;
	readonly kind: string;
	readonly argsstring: string;
	readonly briefdescription: MemberDefDescription;
	readonly detaileddescription: MemberDefDescription;
	readonly ref: BaseCompoundRef;
	readonly initializer: unknown;
}
export interface SectionDef {
	readonly memberdef: MemberDef | MemberDef[];
	readonly kind: string;
}

export interface CompoundDef {
	readonly sectiondef: SectionDef | SectionDef[];
	readonly basecompoundref: BaseCompoundRef | BaseCompoundRef[];
	readonly id: string;
	readonly kind: string;
	readonly language: string;
	readonly prot: string;
}

export interface DXFile {
	readonly doxygen: {
		readonly compounddef: CompoundDef
	};
}

!program.quiet && console.log(chalk.red(figlet.textSync('DX=>MD', {horizontalLayout: 'full'})));
if (program.doxygen && program.output) {
	program.doxygen = path.resolve(program.doxygen);
	program.output = path.resolve(program.output);
	program.templates = program.templates ? path.resolve(program.templates) : path.resolve(__dirname, '../templates');

	fs.readdir(program.doxygen, (err: ErrnoException | null, filesPaths: Array<string>) => {
		filesPaths.forEach((fileName) => {
			let fileMask = /(class|interface|struct)_(.*)\.xml/gm;
			let match = fileMask.exec(fileName);
			if (match) {
				fs.readFile(program.doxygen + '/' + fileName, {encoding:'utf8'}, (err: ErrnoException | null, doxygenXmlFileContent: string) => {
					let doxygenConvertedData: DXFile = xml2json.toJson(doxygenXmlFileContent, {object: true}) as unknown as DXFile;
					let compound = doxygenConvertedData.doxygen.compounddef;
					let templatePath = path.resolve(program.templates, `${match![1]}.md`);
					let convertedCompound = Converter.ConvertAll(compound);

					ejs.renderFile(templatePath, {
						compound: compound,
						cc: convertedCompound
					}, (err: ErrnoException | null, rendered: string) => {
						if (err) throw err;

						let outputFileName = `${compound.id}.md`;
						let outputPath = path.resolve(program.output, outputFileName);
						fs.writeFile(outputPath, rendered, (err: ErrnoException | null) => {
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
		value: function (depth: number = 1) {
			return this.reduce(function (flat: Array<any>, toFlatten: Array<any>) {
				// @ts-ignore
				return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
			}, []);
		}
	});
}