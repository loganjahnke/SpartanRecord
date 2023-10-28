export class Feature
{
	public primary: string;
	public secondary: string;

	constructor(primary: string, secondary?: string)
	{
		this.primary = primary;
		this.secondary = secondary ?? "";
	}
}