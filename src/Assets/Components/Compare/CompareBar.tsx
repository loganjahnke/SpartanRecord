import { CompareBarLeft, CompareBarRight } from "../Custom/BorderLinearProgress";
import { CompareProps } from "./Compare";

export function CompareBar(props: CompareProps)
{
	const { value1 = 0, value2 = 0, lessIsBetter, background = "inherit" } = props;

	return (!lessIsBetter && value1 < value2) || (lessIsBetter && value1 > value2)
		? <CompareBarRight value={50} variant="determinate" sx={{ "> .MuiLinearProgress-bar": { background: background } }} />
		: <CompareBarLeft value={value1 === value2 ? 100 : 50} variant="determinate" sx={{ "> .MuiLinearProgress-bar": { background: background } }} />
}