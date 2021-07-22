import MemberDef from "./MemberDef";

export default interface SectionDef {
	readonly memberdef: MemberDef | MemberDef[];
	readonly kind: string;
}