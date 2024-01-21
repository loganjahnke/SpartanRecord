export class Rounds
{
	public won: number;
	public lost: number;
	public tied: number;

	constructor(data?: any)
	{
		this.won = data?.won ?? 0;
		this.lost = data?.lost ?? 0;
		this.tied = data?.tied ?? 0;
	}
}