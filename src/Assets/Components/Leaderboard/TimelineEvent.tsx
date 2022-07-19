import { TimelineItem, TimelineOppositeContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export function TimelineEvent(props: { label: string, value: number, height?: number, isGood?: boolean, lastEvent?: boolean, isPercent?: boolean })
{
	const { label, value, height, isGood, lastEvent, isPercent } = props;

	return (
		<TimelineItem>
			<TimelineOppositeContent sx={{ mt: 0.25 }} align="right" variant="body2" color={isGood ? "text.primary" : "text.secondary"}>
				{label}
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineDot sx={{ backgroundColor: isGood ? ArrowheadTheme.good : ArrowheadTheme.neutral1 }} />
				{!lastEvent && <TimelineConnector sx={{ height: `${height ?? 50}px`, minHeight: "20px" }} />}
			</TimelineSeparator>
			<TimelineContent>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</TimelineContent>
		</TimelineItem>
	);
}