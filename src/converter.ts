import {ReferenceHelper} from "./helpers/ReferenceHelper";

export class Converter {
	public static ConvertAll(compound: any): any {
		return {
			hierarchy: Converter.ConvertHierarchy(compound),
			summary: Converter.ConvertSummary(compound),
			attributes: Converter.ConvertAttributes(compound),
			properties: Converter.ConvertProperties(compound),
			methods: Converter.ConvertMethods(compound)
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

	public static ConvertSummary(compound: any): any {
		let result: Array<any> = [];

		Converter.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			Converter.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	private static ConvertMemberDef(memberdef:any):any {
		return {
			...Converter.ConvertName(memberdef),
			...Converter.ConvertTypeDefRef(memberdef),
			...Converter.ConvertFuncDef(memberdef),
			...Converter.ConvertDescription(memberdef),
			memberdef: memberdef
		};
	}

	private static ConvertName(memberdef: any): any {
		return {
			name: memberdef.name,
			anchor: memberdef.id,
			anchoredName: `[${memberdef?.name}](#${memberdef?.id})`
		};
	}

	private static ConvertTypeDefRef(memberdef: any): any {
		let type = !!memberdef?.type?.ref ? memberdef.type.ref.$t : memberdef.type;
		if(typeof type === 'object') {
			type = !Object.keys(type).length ? memberdef.name : type
		}

		return {
			// self signature
			typeDef: Converter.ConvertTypeDef(memberdef),
			initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,

			// returns
			type: type,
			typeRef: memberdef?.type?.ref,
			anchoredTypeRef: ReferenceHelper.ReferenceToLink(memberdef?.type?.ref),
		};
	}

	private static ConvertFuncDef(memberdef: any): any {
		let reimplementsRegex = /(.*)_.*$/gm;

		let reimplements = null;
		if(memberdef.reimplements) {
			reimplements = reimplementsRegex.exec(memberdef?.reimplements?.refid);
		}
		return {
			args: memberdef.kind === 'function' ? memberdef.argsstring : '',
			reimplementsAnchor: reimplements ? `[: ${memberdef.reimplements.$t}](${reimplements[1]}.md#${memberdef?.reimplements?.refid})`: '',
		};
	}

	private static ConvertDescription(memberdef: any): any {
		let description = Converter.ToArray(memberdef?.briefdescription?.para)
			.concat(Converter.ToArray(memberdef?.detaileddescription?.para))
			.filter((item: any) => typeof item === 'string');

		return {
			description: description,
			paramDescription:
				Converter.ConvertParameterDescription(memberdef?.briefdescription?.para)
				.concat(Converter.ConvertParameterDescription(memberdef?.detaileddescription?.para))
		};
	}

	private static ConvertParameterDescription(detailedDescriptionPara: any): any {
		return Converter
			.ToArray(detailedDescriptionPara)
			.filter((item: any) => !!item?.simplesect || !!item?.parameterlist)
			.map((item: any) => {
				return [
					...Converter.ToArray(item?.simplesect),
					...Converter.ToArray(item?.parameterlist)
				]
			})
			.flat()
			.map((item: any) => {
				if(item?.kind === 'return') {
					return {
						kind: item?.kind,
						description: item?.para
					};
				}

				return {
					kind: item?.kind,
					parameters: Converter
						.ToArray(item?.parameteritem)
						.map((item: any) => {
							return {
								name: item?.parameternamelist?.parametername,
								description: item?.parameterdescription?.para ? item?.parameterdescription?.para : item?.parameterdescription
							};
						})
				};
			});
	}

	private static ConvertTypeDef(memberdef: any): string {
		let typeDef = '';

		typeDef += memberdef.kind == 'property' ? 'property ' : '';
		typeDef += `${memberdef.prot} `;
		typeDef += memberdef.static == 'yes' ? 'static ' : '';
		typeDef += memberdef.const == 'yes' ? 'const ' : '';
		typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
		typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';

		return typeDef;
	}

	public static ConvertMethods(compound: any): any {
		let result: Array<any> = [];

		Converter.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if(sectiondef.kind.indexOf('func') == -1) return;

			Converter.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertProperties(compound: any): any {
		let result: Array<any> = [];

		Converter.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if(sectiondef.kind.indexOf('prop') == -1) return;

			Converter.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertAttributes(compound: any): any {
		let result: Array<any> = [];

		Converter.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if(sectiondef.kind.indexOf('attrib') == -1) return;

			Converter.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	private static ToArray(obj:any): any {
		if (!obj) {
			return [];
		} else if (Array.isArray(obj)) {
			return obj;
		} else {
			return [obj];
		}
	}
}