export class Leader343
{
    /** The leader's gamertag */
    public gamertag: string;
    /** The leader's appearance */
    public iconUrl: string;
    /** The leader's CSR value */
    public csr: number;
	/** The rank within the list */
    public rank: number;

    constructor(response?: any)
    {
        this.gamertag = response?.player?.gamertag ?? "";
        this.iconUrl = response?.player?.gamerpic_url ?? "";
		this.csr = response?.score ?? 0;
		this.rank = response?.rank ?? 0;
    }
}

export class Leaderboard343
{
    /** The leaders */
    public leaders: Leader343[];

    constructor(response?: any)
    {
        this.leaders = [];
        if (!response || !response.data) { return; }

        for (const player of response.data)
        {
            this.leaders.push(new Leader343(player));
        }
    }
}