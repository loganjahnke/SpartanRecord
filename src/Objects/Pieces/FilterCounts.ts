export class FilterCount
{
	/** The name of the filter */
	public name: string;
	/** The number to show next to it */
	public count: number;

	/**
	 * Creates a filter count
	 * @param filter the filter
	 * @param count the count
	 */
	constructor(filter: string, count: number)
	{
		this.name = filter;
		this.count = count;
	}
}