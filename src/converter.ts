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
		return {
			// self signature
			typeDef: Converter.ConvertTypeDef(memberdef),
			initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,

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

	private static ConvertDescription(memberdef: any): any {
		let shortDescription = memberdef?.briefdescription?.para;
		let detailedDescription = '';
		if(memberdef?.detaileddescription?.para) {
			detailedDescription = ' ' + Converter.ConvertToArray(memberdef?.detaileddescription?.para)
					.filter((item: any) => typeof item === 'string')
					.join(' ');
		}
		return {
			description: `${shortDescription ? shortDescription : ''}${detailedDescription ? detailedDescription : ''}`,
			paramDescription: Converter.ConvertParameterDescription(memberdef?.detaileddescription?.para)
		};
	}

	private static ConvertParameterDescription(detailedDescriptionPara: any): any {
		// TODO: FIX
		return Converter
			.ConvertToArray(detailedDescriptionPara)
			.filter((item: any) => typeof item == 'object')
			// .map((item: any) => {
				// console.log(item);
			// 	return item;
			// })
			.map((item: any) => {
				let parameterDefs = Converter
					.ConvertToArray(item?.parameterlist)
					.map((parameteritem: any) => {
						return Converter
							.ConvertToArray(parameteritem?.parameteritem)
							.map((parameteritem: any) => {
								return {
									kind: parameteritem?.kind,
									name: `\`${parameteritem?.parameternamelist?.parametername}\``,
									description: parameteritem?.parameterdescription?.para
								};
							})
							.filter((parameteritem: any) => !!parameteritem?.description);
					});

				return parameterDefs;
			})
			// .map((item:any) => {
			// 	console.log(JSON.stringify(item, null, '  '));
			// 	return item;
			// })
			// .reduce((prev:any, curr:any) => {
			// 	// console.log(prev, curr);
			// 	return [...prev, curr]
			// }, []);
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

	private static ConvertToArray(obj:any): any {
		if (!obj) {
			return [];
		} else if (Array.isArray(obj)) {
			return obj;
		} else {
			return [obj];
		}
	}
}