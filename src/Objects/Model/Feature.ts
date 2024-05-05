export class Feature
{
	public primary: string;
	public secondary: string;
	public jumpTo?: string;

	constructor(primary: string, secondary?: string, jumpTo?: string)
	{
		this.primary = primary;
		this.secondary = secondary ?? "";
		this.jumpTo = jumpTo;
	}
}