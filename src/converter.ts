import {ReferenceUtils} from "./utils/ReferenceUtils";
import {ParameterUtils} from "./utils/ParameterUtils";
import {ArrayUtils} from "./utils/ArrayUtils";
import {TypeDefinitionUtils} from "./utils/TypeDefinitionUtils";
import CompoundDef from "./models/CompoundDef";
import BaseCompoundRef from "./models/BaseCompoundRef";
import SectionDef from "./models/SectionDef";
import MemberDef from "./models/MemberDef";

export class Converter {
	public static ConvertAll(compound: CompoundDef): any {
		return {
			hierarchy: Converter.ConvertHierarchy(compound),
			summary: Converter.ConvertSummary(compound),
			attributes: Converter.ConvertAttributes(compound),
			properties: Converter.ConvertProperties(compound),
			methods: Converter.ConvertMethods(compound)
		}
	}

	public static ConvertHierarchy(compound: CompoundDef): any {
		let result: any = [];
		if (Array.isArray(compound.basecompoundref)) {
			result.push(...compound.basecompoundref.map((basecompoundref: BaseCompoundRef) => `${basecompoundref.prot} ${basecompoundref.$t}`))
		} else if (compound?.basecompoundref?.prot) {
			result.push(`${compound.basecompoundref.prot} ${compound.basecompoundref.$t}`)
		}
		return result;
	}

	public static ConvertSummary(compound: CompoundDef): any {
		let result: Array<any> = [];

		ArrayUtils.ToArray(compound.sectiondef).forEach((sectiondef: SectionDef) => {
			ArrayUtils.ToArray(sectiondef.memberdef).forEach((memberdef: MemberDef) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	private static ConvertMemberDef(memberdef: MemberDef): any {
		return {
			...Converter.ConvertName(memberdef),
			...Converter.ConvertTypeDefRef(memberdef),
			...Converter.ConvertFuncDef(memberdef),
			...Converter.ConvertDescription(memberdef),
			memberdef: memberdef
		};
	}

	private static ConvertName(memberdef: MemberDef): any {
		return {
			name: memberdef.name,
			anchor: memberdef.id,
			anchoredName: `[${memberdef?.name}](#${memberdef?.id})`
		};
	}

	private static ConvertTypeDefRef(memberdef: MemberDef): any {
		let type = memberdef?.type?.ref?.$t || memberdef.type;
		if (typeof type === 'object') {
			// TODO: some weird shit is goint in here, rewrite it
			type = !Object.keys(type).length ? memberdef.name : type
		}

		return {
			// self signature
			typeDef: TypeDefinitionUtils.ConvertTypeDef(memberdef),
			initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,

			// returns
			type: type,
			typeRef: memberdef?.type?.ref,
			anchoredTypeRef: ReferenceUtils.ReferenceToLink(memberdef?.type?.ref),
		};
	}

	private static ConvertFuncDef(memberdef: MemberDef): any {
		return {
			args: memberdef.kind === 'function' ? memberdef.argsstring : '',
			reimplementsAnchor: ReferenceUtils.InheritanceToLink(memberdef),
		};
	}

	private static ConvertDescription(memberdef: MemberDef): any {
		let description = ArrayUtils.ToArray(memberdef?.briefdescription?.para)
			.concat(ArrayUtils.ToArray(memberdef?.detaileddescription?.para))
			.filter((item: unknown) => typeof item === 'string');

		return {
			description: description,
			paramDescription:
				Converter.ConvertParameterDescription(memberdef?.briefdescription?.para)
					.concat(Converter.ConvertParameterDescription(memberdef?.detaileddescription?.para))
		};
	}

	private static ConvertParameterDescription(descriptionPara: any): any {
		return ParameterUtils.ConvertParameterDescription(ParameterUtils.CollectParametersFromDescription(descriptionPara));
	}

	public static ConvertMethods(compound: CompoundDef): any {
		let result: Array<any> = [];

		ArrayUtils.ToArray(compound.sectiondef).forEach((sectiondef: SectionDef) => {
			if (sectiondef.kind.includes('func')) return;

			ArrayUtils.ToArray(sectiondef.memberdef).forEach((memberdef: MemberDef) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertProperties(compound: CompoundDef): any {
		let result: Array<any> = [];

		ArrayUtils.ToArray(compound.sectiondef).forEach((sectiondef: SectionDef) => {
			if (sectiondef.kind.includes('prop')) return;

			ArrayUtils.ToArray(sectiondef.memberdef).forEach((memberdef: MemberDef) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertAttributes(compound: CompoundDef): any {
		let result: Array<any> = [];

		ArrayUtils.ToArray(compound.sectiondef).forEach((sectiondef: SectionDef) => {
			if (sectiondef.kind.includes('attrib')) return;

			ArrayUtils.ToArray(sectiondef.memberdef).forEach((memberdef: MemberDef) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}


}