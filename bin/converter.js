"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
var ReferenceUtils_1 = require("./utils/ReferenceUtils");
var ParameterUtils_1 = require("./utils/ParameterUtils");
var ArrayUtils_1 = require("./utils/ArrayUtils");
var TypeDefinitionUtils_1 = require("./utils/TypeDefinitionUtils");
var Converter = /** @class */ (function () {
    function Converter() {
    }
    Converter.ConvertAll = function (compound) {
        return {
            hierarchy: Converter.ConvertHierarchy(compound),
            summary: Converter.ConvertSummary(compound),
            attributes: Converter.ConvertAttributes(compound),
            properties: Converter.ConvertProperties(compound),
            methods: Converter.ConvertMethods(compound)
        };
    };
    Converter.ConvertHierarchy = function (compound) {
        var _a;
        var result = [];
        if (Array.isArray(compound.basecompoundref)) {
            result.push.apply(result, compound.basecompoundref.map(function (basecompoundref) { return basecompoundref.prot + " " + basecompoundref.$t; }));
        }
        else if ((_a = compound === null || compound === void 0 ? void 0 : compound.basecompoundref) === null || _a === void 0 ? void 0 : _a.prot) {
            result.push(compound.basecompoundref.prot + " " + compound.basecompoundref.$t);
        }
        return result;
    };
    Converter.ConvertSummary = function (compound) {
        var result = [];
        ArrayUtils_1.ArrayUtils.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            ArrayUtils_1.ArrayUtils.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertMemberDef = function (memberdef) {
        return __assign(__assign(__assign(__assign(__assign({}, Converter.ConvertName(memberdef)), Converter.ConvertTypeDefRef(memberdef)), Converter.ConvertFuncDef(memberdef)), Converter.ConvertDescription(memberdef)), { memberdef: memberdef });
    };
    Converter.ConvertName = function (memberdef) {
        return {
            name: memberdef.name,
            anchor: memberdef.id,
            anchoredName: "[" + (memberdef === null || memberdef === void 0 ? void 0 : memberdef.name) + "](#" + (memberdef === null || memberdef === void 0 ? void 0 : memberdef.id) + ")"
        };
    };
    Converter.ConvertTypeDefRef = function (memberdef) {
        var _a, _b, _c, _d;
        var type = ((_b = (_a = memberdef === null || memberdef === void 0 ? void 0 : memberdef.type) === null || _a === void 0 ? void 0 : _a.ref) === null || _b === void 0 ? void 0 : _b.$t) || memberdef.type;
        if (typeof type === 'object') {
            // TODO: some weird shit is goint in here, rewrite it
            type = !Object.keys(type).length ? memberdef.name : type;
        }
        return {
            // self signature
            typeDef: TypeDefinitionUtils_1.TypeDefinitionUtils.ConvertTypeDef(memberdef),
            initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,
            // returns
            type: type,
            typeRef: (_c = memberdef === null || memberdef === void 0 ? void 0 : memberdef.type) === null || _c === void 0 ? void 0 : _c.ref,
            anchoredTypeRef: ReferenceUtils_1.ReferenceUtils.ReferenceToLink((_d = memberdef === null || memberdef === void 0 ? void 0 : memberdef.type) === null || _d === void 0 ? void 0 : _d.ref),
        };
    };
    Converter.ConvertFuncDef = function (memberdef) {
        return {
            args: memberdef.kind === 'function' ? memberdef.argsstring : '',
            reimplementsAnchor: ReferenceUtils_1.ReferenceUtils.InheritanceToLink(memberdef),
        };
    };
    Converter.ConvertDescription = function (memberdef) {
        var _a, _b, _c, _d;
        var description = ArrayUtils_1.ArrayUtils.ToArray((_a = memberdef === null || memberdef === void 0 ? void 0 : memberdef.briefdescription) === null || _a === void 0 ? void 0 : _a.para)
            .concat(ArrayUtils_1.ArrayUtils.ToArray((_b = memberdef === null || memberdef === void 0 ? void 0 : memberdef.detaileddescription) === null || _b === void 0 ? void 0 : _b.para))
            .filter(function (item) { return typeof item === 'string'; });
        return {
            description: description,
            paramDescription: Converter.ConvertParameterDescription((_c = memberdef === null || memberdef === void 0 ? void 0 : memberdef.briefdescription) === null || _c === void 0 ? void 0 : _c.para)
                .concat(Converter.ConvertParameterDescription((_d = memberdef === null || memberdef === void 0 ? void 0 : memberdef.detaileddescription) === null || _d === void 0 ? void 0 : _d.para))
        };
    };
    Converter.ConvertParameterDescription = function (descriptionPara) {
        return ParameterUtils_1.ParameterUtils.ConvertParameterDescription(ParameterUtils_1.ParameterUtils.CollectParametersFromDescription(descriptionPara));
    };
    Converter.ConvertMethods = function (compound) {
        var result = [];
        ArrayUtils_1.ArrayUtils.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.includes('func'))
                return;
            ArrayUtils_1.ArrayUtils.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertProperties = function (compound) {
        var result = [];
        ArrayUtils_1.ArrayUtils.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.includes('prop'))
                return;
            ArrayUtils_1.ArrayUtils.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertAttributes = function (compound) {
        var result = [];
        ArrayUtils_1.ArrayUtils.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.includes('attrib'))
                return;
            ArrayUtils_1.ArrayUtils.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    return Converter;
}());
exports.Converter = Converter;
