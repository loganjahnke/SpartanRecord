import { CompareBarLeft, CompareBarRight } from "../Custom/BorderLinearProgress";
import { CompareProps } from "./Compare";

export function CompareBar(props: CompareProps)
{
	const { value1 = 0, value2 = 0, lessIsBetter, background = "auto", value1back, value2back } = props;

	let color = (!lessIsBetter && value1 < value2) || (lessIsBetter && value1 > value2) 
		? (value2back || background) 
		: (value1back || background);

	return (!lessIsBetter && value1 < value2) || (lessIsBetter && value1 > value2)
		? <CompareBarRight value={50} variant="determinate" sx={{ "> .MuiLinearProgress-bar": { background: color + " !important", backgroundColor: color + " !important" } }} />
		: <CompareBarLeft value={value1 === value2 ? 100 : 50} variant="determinate" sx={{ "> .MuiLinearProgress-bar": { background: color + " !important", backgroundColor: color + " !important" } }} />
}