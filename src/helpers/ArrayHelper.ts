export class ArrayHelper {
	public static ToArray(obj:any): any {
		if (!obj) {
			return [];
		} else if (Array.isArray(obj)) {
			return obj;
		} else {
			return [obj];
		}
	}
}