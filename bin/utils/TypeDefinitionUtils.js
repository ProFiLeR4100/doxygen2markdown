"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDefinitionUtils = void 0;
var TypeDefinitionUtils = /** @class */ (function () {
    function TypeDefinitionUtils() {
    }
    TypeDefinitionUtils.ConvertTypeDef = function (memberdef) {
        var typeDef = '';
        typeDef += memberdef.kind == 'property' ? 'property ' : '';
        typeDef += memberdef.prot + " ";
        typeDef += memberdef.static == 'yes' ? 'static ' : '';
        typeDef += memberdef.const == 'yes' ? 'const ' : '';
        typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
        typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
        return typeDef;
    };
    return TypeDefinitionUtils;
}());
exports.TypeDefinitionUtils = TypeDefinitionUtils;
