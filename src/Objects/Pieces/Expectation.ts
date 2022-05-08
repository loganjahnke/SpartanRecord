export class Expectation
{
    /** The actual amount */
    public actual: number;
    /** The expected amount */
    public expected: number;
    /** The standard deviation */
    public standardDeviation: number;

    constructor(data?: any)
    {
        this.actual = data?.count ?? -1;
        this.expected = data?.expected ?? -1;
        this.standardDeviation = data?.standard_deviation ?? -1;
    }
}