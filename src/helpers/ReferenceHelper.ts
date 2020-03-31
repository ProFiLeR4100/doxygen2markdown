export class ReferenceHelper {
	public static ReferenceToLink(memberdef: any): string | null {
		if (!memberdef) return null;
		return memberdef.kindref === "compound" ? `[${memberdef.$t}](${memberdef.refid}.md#${memberdef.$t})` : `#${memberdef.$t}`;
	}

	public static InheritanceToLink(memberdef: any): string | null {
		if (!memberdef) return null;
		const reimplementsRegex = /(.*)_.*$/gm;
		let reimplements = null;
		if (memberdef.reimplements) {
			reimplements = reimplementsRegex.exec(memberdef?.reimplements?.refid);
		}
		return reimplements && `[: ${memberdef.reimplements.$t}](${reimplements[1]}.md#${memberdef?.reimplements?.refid})`;
	}
}