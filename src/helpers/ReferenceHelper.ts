export class ReferenceHelper {
	public static ReferenceToLink(memberdef: any): string|undefined {
		if (!memberdef) return;
		return memberdef.kindref === "compound" ? `[${!!memberdef ? memberdef.$t : memberdef.type}](${memberdef.refid}.md#${memberdef.$t})` : `#${memberdef.$t}`;
	}

	public static InheritanceReferenceToLink(memberdef: any): string|undefined {
		if (!memberdef) return;

		return memberdef.kindref === "compound" ? `[: ${!!memberdef ? memberdef.$t : memberdef.type}](${memberdef.refid}.md#${memberdef.$t})` : `#${memberdef.$t}`;
	}
}