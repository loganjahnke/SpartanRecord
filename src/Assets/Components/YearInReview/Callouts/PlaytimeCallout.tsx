import { Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { OpacityBox } from "../../Animations/OpacityBox";

interface PlaytimeCalloutProps extends CalloutsProps
{
	subdelay: string;	
}

/**
 * A component to wrap text around a zoom animation
 */
export function PlaytimeCallout(props: PlaytimeCalloutProps)
{
	const { delay, player, subdelay } = props;

	return (
		<GridItemCentered>
			<OpacityBox delay={delay} content={
				<>
					<Typography>You've played a lot of Halo Infinite this year! In fact, you played</Typography>
					<Typography variant="h3">{player?.serviceRecord.matchesPlayed.toLocaleString()} matches</Typography>
					<OpacityBox delay={subdelay} nested content={
						<>
							<Typography sx={{ mt: 2 }}>That's a grand total of</Typography>
							<Typography variant="h4" sx={{ fontWeight: 600 }}>{player?.serviceRecord.timePlayed.readable()}</Typography>
							<Typography>of time spent in Halo Infinite!</Typography>
						</>
					} />
				</>
			} />
		</GridItemCentered>
	);
}