import { CompareBarLeft, CompareBarRight } from "../Custom/BorderLinearProgress";

export function CompareBar(props: { value1?: number, value2?: number, lessIsBetter?: boolean })
{
	const { value1 = 0, value2 = 0, lessIsBetter } = props;

	return (!lessIsBetter && value1 < value2) || (lessIsBetter && value1 > value2)
		? <CompareBarRight value={50} variant="determinate" />
		: <CompareBarLeft value={value1 === value2 ? 100 : 50} variant="determinate" />
}