export class MMR
{
	public lastSpartanStanding: number;
	public ffa: number;

	constructor(lss?: number, ffa?: number)
	{
		this.lastSpartanStanding = lss ?? 0;
		this.ffa = ffa ?? 0;
	}
}