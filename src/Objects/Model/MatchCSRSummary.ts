import { Rank } from "./CSRS";

export class MatchCSRSummary
{
	/** Pre-match */
	public pre: Rank;
	/** Post-match */
	public post: Rank;

	constructor(data?: any)
	{
		this.pre = new Rank(data?.csr?.pre_match);
		this.post = new Rank(data?.csr?.post_match);
	}
}

export class MatchCSR
{
	/** The CSR value */
	public value: number;
	/** The CSR tier (platinum, diamond, etc) */
	public tier: string;
	/** The CSR subtier (1-6) */
	public subTier: number;
	/** The initial amount of measure matches */
	public initialMeasurementMatches: number;
	/** The number of measurement matches remaining */
	public measurementMatchesRemaining: number;

	constructor(data: any)
	{
		this.value = data?.value;
		this.tier = data?.tier;
		this.subTier = data?.sub_tier;
		this.initialMeasurementMatches = data?.initial_measurement_matches;
		this.measurementMatchesRemaining = data?.measurement_matches_remaining;
	}
}