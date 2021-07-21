import {ArrayUtils} from "./ArrayUtils";

export class ParameterUtils {
	public static ConvertParameterDescription(parameterKind: any[]) {
		return parameterKind.map((item: any) => {
			if (item?.kind === 'return') {
				return {
					kind: item?.kind,
					description: item?.para
				};
			}

			return {
				kind: item?.kind,
				parameters: ArrayUtils
					.ToArray(item?.parameteritem)
					.map((item: any) => {
						return {
							name: item?.parameternamelist?.parametername,
							description: item?.parameterdescription?.para ? item?.parameterdescription?.para : item?.parameterdescription
						};
					})
			};
		});
	}

	public static CollectParametersFromDescription(descriptionPara: any) {
		return ArrayUtils
			.ToArray(descriptionPara)
			.filter((item: any) => !!item?.simplesect || !!item?.parameterlist)
			.map((item: any) => {
				return [
					...ArrayUtils.ToArray(item?.simplesect),
					...ArrayUtils.ToArray(item?.parameterlist)
				]
			})
			.flat()
	}
}