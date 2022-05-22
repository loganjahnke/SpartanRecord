export class SRFilter
{
	/** The name of the filter */
	public name: string;
	/** The ID of the filter */
	public id: string;
	/** The number to show next to it */
	public count: number;

	/**
	 * Creates a filter count
	 * @param filter the filter
	 * @param id the id
	 * @param count the count
	 */
	constructor(filter: string, id: string, count: number)
	{
		this.name = filter;
		this.id = id;
		this.count = count;
	}
}