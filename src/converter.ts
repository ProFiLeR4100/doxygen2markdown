export class Converter {
	public static ConvertAll(compound: any): any {
		return {
			sectionTranslations: {
				// Attributes
				'public-attrib': 'Public Attributes',
				'private-attrib': 'Private Attributes',
				'public-static-attrib': 'Private Static Attributes',
				'private-static-attrib': 'Private Static Attributes',

				// Properties
				'property': 'Properties',

				// Methods
				'public-func': 'Public Methods',
				'private-func': 'Private Methods',
				'public-static-func': 'Static Public Methods',
				'private-static-func': 'Static Private Methods'
			},
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

		Converter.ConvertToArray(compound.sectiondef).forEach((sectiondef: any) => {
			Converter.ConvertToArray(sectiondef.memberdef).forEach((memberdef: any) => {
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

			description: memberdef?.briefdescription?.para,
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
		return {
			// self signature
			typeDef: Converter.ConvertTypeDef(memberdef),

			// returns
			type: !!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type,
			typeRef: memberdef?.type?.ref,
			anchoredTypeRef: memberdef?.type?.ref?.kindref == "compound" ? `[${!!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type}](${memberdef?.type?.ref?.refid}.md#${memberdef?.type?.ref?.$t})` : `#${memberdef?.type?.ref?.$t}`,
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

		Converter.ConvertToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if(sectiondef.kind.indexOf('func') == -1) return;

			Converter.ConvertToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertProperties(compound: any): any {
		let result: Array<any> = [];

		Converter.ConvertToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if(sectiondef.kind.indexOf('prop') == -1) return;

			Converter.ConvertToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	public static ConvertAttributes(compound: any): any {
		let result: Array<any> = [];

		Converter.ConvertToArray(compound.sectiondef).forEach((sectiondef: any) => {
			if(sectiondef.kind.indexOf('attrib') == -1) return;

			Converter.ConvertToArray(sectiondef.memberdef).forEach((memberdef: any) => {
				result.push(Converter.ConvertMemberDef(memberdef));
			});
		});

		return result;
	}

	private static ConvertToArray(obj:any): Array<any> {
		if (!obj) {
			return [];
		} else if (Array.isArray(obj)) {
			return obj;
		} else {
			return [obj];
		}
	}
}