#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const pjson = require('../package.json');
const path = require('path');
const program = require('commander');
const fs = require('fs');
const xml2json = require('xml2json');
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
			let fileMask = /(class|interface)_(.*)\.xml/gm;
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

						let outputPath = path.resolve(program.output, `${compound.id}.md`);
						fs.writeFile(outputPath, rendered, function (err: Error) {
							if (err) throw err;
						});
					});
				});
			}
		})
	});
}


class Converter {
	public static ConvertAll(compound: any): any {
		return {
			hierarchy: Converter.ConvertHierarchy(compound),
			summary: Converter.ConvertSummary(compound),
			properties: Converter.ConvertProperties(compound),
			functions: Converter.ConvertFunctions(compound),
			attributes: Converter.ConvertAttributes(compound)
		}
	}

	public static ConvertHierarchy(compound: any): any {
		let result: any = [];
		if (Array.isArray(compound.basecompoundref)) {
			result.push(...compound.basecompoundref.map((basecompoundref: any) => `${basecompoundref.prot} ${basecompoundref.$t}`))
		} else if (compound?.basecompoundref?.prot) {
			result.push(`${compound.basecompoundref.prot} ${compound.basecompoundref.$t}`)
		}
		return result;
	}

	public static ConvertProperties(compound: any): any {
		return [];
	}

	public static ConvertSummary(compound: any): any {
		let result: Array<any> = [];

		Array.isArray(compound.sectiondef) && compound.sectiondef.forEach((sectiondef: any) => {
			Array.isArray(sectiondef.memberdef) && sectiondef.memberdef.forEach((memberdef: any) => {
				let typeDef = '';

				typeDef += memberdef.kind == 'property' ? 'property ' : '';
				typeDef += `${memberdef.prot} `;
				typeDef += memberdef.static == 'yes' ? 'static ' : '';
				typeDef += memberdef.const == 'yes' ? 'const ' : '';
				typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
				typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';

				result.push({
					typeDef: typeDef,

					name: memberdef.name,
					anchor: memberdef.id,
					anchoredName: `[${memberdef?.name}](#${memberdef?.id})`,

					type: !!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type,
					typeRef: memberdef?.type?.ref,
					anchoredTypeRef: memberdef?.type?.ref?.kindref == "compound" ? `[${!!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type}](${memberdef?.type?.ref?.refid}.md#${memberdef?.type?.ref?.$t})` : `#${memberdef?.type?.ref?.$t}`,

					args: memberdef.kind === 'function' ? memberdef.argsstring : '',
					description: memberdef?.briefdescription?.para,
				});
			});
		});

		return result;
	}

	public static ConvertFunctions(compound: any): any {
		return [];
	}

	public static ConvertAttributes(compound: any): any {
		return [];
	}
}


if (!process.argv.slice(2).length) {
	program.outputHelp();
}
