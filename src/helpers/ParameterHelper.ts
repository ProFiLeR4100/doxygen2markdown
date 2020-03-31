import {ArrayHelper} from "./ArrayHelper";

export class ParameterHelper {
	public static ConvertParameterDescription(parameterKind: any[]) {
		return parameterKind.map((item: any) => {
			if(item?.kind === 'return') {
				return {
					kind: item?.kind,
					description: item?.para
				};
			}

			return {
				kind: item?.kind,
				parameters: ArrayHelper
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
		return ArrayHelper
			.ToArray(descriptionPara)
			.filter((item: any) => !!item?.simplesect || !!item?.parameterlist)
			.map((item: any) => {
				return [
					...ArrayHelper.ToArray(item?.simplesect),
					...ArrayHelper.ToArray(item?.parameterlist)
				]
			})
			.flat()
	}
}