import { Typography } from "@mui/material";

interface CalloutStatProps
{
	text: string | number;
}

/**
 * Typography span with specific styling for a callout statistic
 */
export function CalloutStat(props: CalloutStatProps)
{
	const { text } = props;
	return <Typography component="span" variant="h5" sx={{ fontWeight: 600 }}>{text.toLocaleString()}</Typography>;
}