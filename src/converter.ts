import {ReferenceHelper} from "./helpers/ReferenceHelper";
import {ParameterHelper} from "./helpers/ParameterHelper";
import {ArrayHelper} from "./helpers/ArrayHelper";
import {TypeDefinitionHelper} from "./helpers/TypeDefinitionHelper";

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

		ArrayHelper.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			ArrayHelper.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	private static ConvertMemberDef(memberdef: any): any {
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
		if (typeof type === 'object') {
			type = !Object.keys(type).length ? memberdef.name : type
		}

		return {
			// self signature
			typeDef: TypeDefinitionHelper.ConvertTypeDef(memberdef),
			initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,

			// returns
			type: type,
			typeRef: memberdef?.type?.ref,
			anchoredTypeRef: ReferenceHelper.ReferenceToLink(memberdef?.type?.ref),
		};
	}

	private static ConvertFuncDef(memberdef: any): any {
		return {
			args: memberdef.kind === 'function' ? memberdef.argsstring : '',
			reimplementsAnchor: ReferenceHelper.InheritanceToLink(memberdef),
		};
	}

	private static ConvertDescription(memberdef: any): any {
		let description = ArrayHelper.ToArray(memberdef?.briefdescription?.para)
			.concat(ArrayHelper.ToArray(memberdef?.detaileddescription?.para))
			.filter((item: any) => typeof item === 'string');

		return {
			description: description,
			paramDescription:
				Converter.ConvertParameterDescription(memberdef?.briefdescription?.para)
					.concat(Converter.ConvertParameterDescription(memberdef?.detaileddescription?.para))
		};
	}

	private static ConvertParameterDescription(descriptionPara: any): any {
		return ParameterHelper.ConvertParameterDescription(ParameterHelper.CollectParametersFromDescription(descriptionPara));
	}

	public static ConvertMethods(compound: any): any {
		let result: Array<any> = [];

		ArrayHelper.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if (sectiondef.kind.indexOf('func') == -1) return;

			ArrayHelper.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertProperties(compound: any): any {
		let result: Array<any> = [];

		ArrayHelper.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if (sectiondef.kind.indexOf('prop') == -1) return;

			ArrayHelper.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertAttributes(compound: any): any {
		let result: Array<any> = [];

		ArrayHelper.ToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if (sectiondef.kind.indexOf('attrib') == -1) return;

			ArrayHelper.ToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}


}