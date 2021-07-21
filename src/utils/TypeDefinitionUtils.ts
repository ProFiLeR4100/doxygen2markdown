export class TypeDefinitionUtils {
	public static ConvertTypeDef(memberdef: any): string {
		let typeDef = '';

		typeDef += memberdef.kind == 'property' ? 'property ' : '';
		typeDef += `${memberdef.prot} `;
		typeDef += memberdef.static == 'yes' ? 'static ' : '';
		typeDef += memberdef.const == 'yes' ? 'const ' : '';
		typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
		typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';

		return typeDef;
	}
}