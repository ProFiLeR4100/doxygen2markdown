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
var ReferenceHelper_1 = require("./helpers/ReferenceHelper");
var ParameterHelper_1 = require("./helpers/ParameterHelper");
var ArrayHelper_1 = require("./helpers/ArrayHelper");
var TypeDefinitionHelper_1 = require("./helpers/TypeDefinitionHelper");
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
        var _a, _b;
        var result = [];
        if (Array.isArray(compound.basecompoundref)) {
            result.push.apply(result, compound.basecompoundref.map(function (basecompoundref) { return basecompoundref.prot + " " + basecompoundref.$t; }));
        }
        else if ((_b = (_a = compound) === null || _a === void 0 ? void 0 : _a.basecompoundref) === null || _b === void 0 ? void 0 : _b.prot) {
            result.push(compound.basecompoundref.prot + " " + compound.basecompoundref.$t);
        }
        return result;
    };
    Converter.ConvertSummary = function (compound) {
        var result = [];
        ArrayHelper_1.ArrayHelper.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            ArrayHelper_1.ArrayHelper.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertMemberDef = function (memberdef) {
        return __assign(__assign(__assign(__assign(__assign({}, Converter.ConvertName(memberdef)), Converter.ConvertTypeDefRef(memberdef)), Converter.ConvertFuncDef(memberdef)), Converter.ConvertDescription(memberdef)), { memberdef: memberdef });
    };
    Converter.ConvertName = function (memberdef) {
        var _a, _b;
        return {
            name: memberdef.name,
            anchor: memberdef.id,
            anchoredName: "[" + ((_a = memberdef) === null || _a === void 0 ? void 0 : _a.name) + "](#" + ((_b = memberdef) === null || _b === void 0 ? void 0 : _b.id) + ")"
        };
    };
    Converter.ConvertTypeDefRef = function (memberdef) {
        var _a, _b, _c, _d, _e, _f;
        var type = !!((_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.ref) ? memberdef.type.ref.$t : memberdef.type;
        if (typeof type === 'object') {
            type = !Object.keys(type).length ? memberdef.name : type;
        }
        return {
            // self signature
            typeDef: TypeDefinitionHelper_1.TypeDefinitionHelper.ConvertTypeDef(memberdef),
            initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,
            // returns
            type: type,
            typeRef: (_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.ref,
            anchoredTypeRef: ReferenceHelper_1.ReferenceHelper.ReferenceToLink((_f = (_e = memberdef) === null || _e === void 0 ? void 0 : _e.type) === null || _f === void 0 ? void 0 : _f.ref),
        };
    };
    Converter.ConvertFuncDef = function (memberdef) {
        return {
            args: memberdef.kind === 'function' ? memberdef.argsstring : '',
            reimplementsAnchor: ReferenceHelper_1.ReferenceHelper.InheritanceToLink(memberdef),
        };
    };
    Converter.ConvertDescription = function (memberdef) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var description = ArrayHelper_1.ArrayHelper.ToArray((_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.briefdescription) === null || _b === void 0 ? void 0 : _b.para)
            .concat(ArrayHelper_1.ArrayHelper.ToArray((_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.detaileddescription) === null || _d === void 0 ? void 0 : _d.para))
            .filter(function (item) { return typeof item === 'string'; });
        return {
            description: description,
            paramDescription: Converter.ConvertParameterDescription((_f = (_e = memberdef) === null || _e === void 0 ? void 0 : _e.briefdescription) === null || _f === void 0 ? void 0 : _f.para)
                .concat(Converter.ConvertParameterDescription((_h = (_g = memberdef) === null || _g === void 0 ? void 0 : _g.detaileddescription) === null || _h === void 0 ? void 0 : _h.para))
        };
    };
    Converter.ConvertParameterDescription = function (descriptionPara) {
        return ParameterHelper_1.ParameterHelper.ConvertParameterDescription(ParameterHelper_1.ParameterHelper.CollectParametersFromDescription(descriptionPara));
    };
    Converter.ConvertMethods = function (compound) {
        var result = [];
        ArrayHelper_1.ArrayHelper.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('func') == -1)
                return;
            ArrayHelper_1.ArrayHelper.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertProperties = function (compound) {
        var result = [];
        ArrayHelper_1.ArrayHelper.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('prop') == -1)
                return;
            ArrayHelper_1.ArrayHelper.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertAttributes = function (compound) {
        var result = [];
        ArrayHelper_1.ArrayHelper.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('attrib') == -1)
                return;
            ArrayHelper_1.ArrayHelper.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    return Converter;
}());
exports.Converter = Converter;
