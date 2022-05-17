export class SRFilter
{
	/** The name of the filter */
	public name: string;
	/** The number to show next to it */
	public id: string;

	/**
	 * Creates a filter count
	 * @param filter the filter
	 * @param id the id
	 */
	constructor(filter: string, id: string)
	{
		this.name = filter;
		this.id = id;
	}
}