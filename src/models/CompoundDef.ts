import SectionDef from "./SectionDef";
import BaseCompoundRef from "./BaseCompoundRef";

export default interface CompoundDef {
	readonly sectiondef: SectionDef | SectionDef[];
	readonly basecompoundref: BaseCompoundRef | BaseCompoundRef[];
	readonly id: string;
	readonly kind: string;
	readonly language: string;
	readonly prot: string;
}