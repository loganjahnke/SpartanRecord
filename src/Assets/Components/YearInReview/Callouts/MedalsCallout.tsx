import { Box, Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { OpacityBox } from "../../Animations/OpacityBox";
import { TopMedalsInner } from "../../Medals/TopMedals";
import { CalloutStat } from "../Typography/CalloutStat";

interface MedalsCalloutProps extends CalloutsProps
{
	bestRareMedalDelay: string;
	rarestRareMedalDelay: string;
}

/**
 * A component to wrap text around a zoom animation
 */
export function MedalsCallout(props: MedalsCalloutProps)
{
	const { delay, player, bestRareMedalDelay, rarestRareMedalDelay } = props;

	if (!player) { return <></>; }

	const bestRareMedal = player.serviceRecord.getRarestMedal(true);
	const rarestRareMedal = player.serviceRecord.getRarestMedal();

	return (
		<GridItemCentered>
			<OpacityBox delay={delay} content={
				<>
					<Typography variant="h6">Let's take a look at your <CalloutStat text="top" /> medals!</Typography>
					<TopMedalsInner medals={player.serviceRecord.medals} animate />
					{bestRareMedal && 
						<OpacityBox delay={bestRareMedalDelay} nested content={
							<Box sx={{ mt: 4, width: "100%" }}>
								<Typography variant="h6">Let's see your <CalloutStat text="best" /> medal!</Typography>
								<TopMedalsInner medals={[bestRareMedal]} animate />
							</Box>
						} />
					}
					{rarestRareMedal && 
						<OpacityBox delay={rarestRareMedalDelay} nested content={
							<Box sx={{ mt: 4, width: "100%" }}>
								<Typography variant="h6">And your <CalloutStat text="rarest" /> medal!</Typography>
								<TopMedalsInner medals={[rarestRareMedal]} animate />
							</Box>
						} />
					}
				</>
			} />
		</GridItemCentered>
	);
}