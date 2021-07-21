export declare class ParameterUtils {
    static ConvertParameterDescription(parameterKind: any[]): ({
        kind: any;
        description: any;
        parameters?: undefined;
    } | {
        kind: any;
        parameters: any;
        description?: undefined;
    })[];
    static CollectParametersFromDescription(descriptionPara: any): any;
}
