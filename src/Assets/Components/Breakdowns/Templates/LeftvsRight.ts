export class LeftvsRight
{
	public leftValue: string | number;
	public rightValue: string | number;
	public leftDesc: string;
	public rightDesc: string;
	public expectedLeft?: number;
	public expectedRight?: number;
	public middleValue?: number;
	public middleDesc?: string;
	public middleTooltip?: string;

	constructor(leftValue: string | number, rightValue: string | number, leftDesc: string, rightDesc: string, expectedLeft?: number, expectedRight?: number, middleValue?: number, middleDesc?: string, middleTooltip?: string)
	{
		this.leftValue = leftValue;
		this.rightValue = rightValue;
		this.leftDesc = leftDesc;
		this.rightDesc = rightDesc;
		this.expectedLeft = expectedLeft;
		this.expectedRight = expectedRight;
		this.middleValue = middleValue;
		this.middleDesc = middleDesc;
		this.middleTooltip = middleTooltip;
	}
}