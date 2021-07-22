import CompoundDef from "./CompoundDef";

export default interface DXFile {
	readonly doxygen: {
		readonly compounddef: CompoundDef
	};
}