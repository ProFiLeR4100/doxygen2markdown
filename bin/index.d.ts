#!/usr/bin/env node
export interface BaseCompoundRef {
    readonly refid: string;
    readonly prot: string;
    readonly virt: string;
    readonly $t: string;
}
export interface MemberDefDescription {
    readonly para: unknown | unknown[];
}
export interface TypeRef {
    readonly $t: string;
}
export interface TypeDef {
    readonly ref: TypeRef;
}
export interface MemberDef {
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
export interface SectionDef {
    readonly memberdef: MemberDef | MemberDef[];
    readonly kind: string;
}
export interface CompoundDef {
    readonly sectiondef: SectionDef | SectionDef[];
    readonly basecompoundref: BaseCompoundRef | BaseCompoundRef[];
    readonly id: string;
    readonly kind: string;
    readonly language: string;
    readonly prot: string;
}
export interface DXFile {
    readonly doxygen: {
        readonly compounddef: CompoundDef;
    };
}
