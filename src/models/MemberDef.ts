import TypeDef from "./TypeDef";
import MemberDefDescription from "./MemberDefDescription";
import BaseCompoundRef from "./BaseCompoundRef";

export default interface MemberDef {
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