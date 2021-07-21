import { CompoundDef } from "./index";
export declare class Converter {
    static ConvertAll(compound: CompoundDef): any;
    static ConvertHierarchy(compound: CompoundDef): any;
    static ConvertSummary(compound: CompoundDef): any;
    private static ConvertMemberDef;
    private static ConvertName;
    private static ConvertTypeDefRef;
    private static ConvertFuncDef;
    private static ConvertDescription;
    private static ConvertParameterDescription;
    static ConvertMethods(compound: CompoundDef): any;
    static ConvertProperties(compound: CompoundDef): any;
    static ConvertAttributes(compound: CompoundDef): any;
}
