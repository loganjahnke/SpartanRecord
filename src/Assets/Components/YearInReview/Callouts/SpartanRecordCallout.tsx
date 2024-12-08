import { Box, Button, Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { OpacityBox } from "../../Animations/OpacityBox";
import { CalloutStat } from "../Typography/CalloutStat";
import { SRTabs } from "../../Layout/AHDrawer";

import logo from "../../../Images/LogoRefresh/Logo2023.png";

interface SpartanRecordCalloutProps extends CalloutsProps
{
	patreonDelay: string;
	isSubscribedToPatreon?: boolean;
	switchTab: (url?: string, tab?: SRTabs) => void;
}

/**
 * A component to wrap text around a zoom animation
 */
export function SpartanRecordCallout(props: SpartanRecordCalloutProps)
{
	const { delay, patreonDelay, player, isSubscribedToPatreon, switchTab } = props;

	if (!player) { return <></>; }
	return (
		<GridItemCentered>
			<OpacityBox delay={delay} content={
				<>
					<img src={logo} alt="Spartan Record" height="96px" />
					<Typography sx={{ mt: 1 }}>You were one of <CalloutStat text="65,004" /> users</Typography>
					<Typography>to visit SpartanRecord.com this year!</Typography>
					{player.gamertag?.toUpperCase() === "BLOODSNOW" && <Typography sx={{ mt: 2 }}>Yo, <CalloutStat text="Bloodsnow" />, you were the #1 user this year, your gamertag was searched on SpartanRecord.com over <CalloutStat text="10,000" /> times! Thank you so much for using the site!</Typography>}
					{player.gamertag?.toUpperCase() === "ZENY IC" && <Typography sx={{ mt: 2 }}>Thanks <CalloutStat text="Zeny IC" /> for making this website possible!</Typography>}
					<OpacityBox delay={patreonDelay} nested content={
						isSubscribedToPatreon
						?
							<Box sx={{ mt: 2 }}>
								<Typography>SpartanRecord.com gained <CalloutStat text="4" /> Patreon subscribers this year!</Typography>
								<Typography sx={{ mt: 2 }}><CalloutStat text={player.gamertag} />, thank you so much</Typography>
								<Typography>for a being a supporter!</Typography>
								<Typography sx={{ mt: 2 }}>That's all for Year in Review, thanks for using SpartanRecord.com!</Typography>
								<Button variant="outlined" sx={{ mt: 3 }} href="https://x.com/Spartan_Record">Follow us on Twitter</Button>
							</Box>
						:
							<Box sx={{ mt: 2 }}>
								<Typography>SpartanRecord.com gained <CalloutStat text="4" /> Patreon subscribers this year! Thank you to all our supporters!</Typography>
								<Typography sx={{ mt: 2 }}>That's all for Year in Review, thanks for using SpartanRecord.com!</Typography>
								<Box sx={{ display: "flex", mt: 3, justifyContent: "center" }}>
									<Button variant="outlined" href="https://x.com/Spartan_Record" sx={{ mr: 1 }}>Follow us on Twitter</Button>
									<Button variant="contained" onClick={() => switchTab(`subscribe/${player.gamertag}`, SRTabs.Subscribe)} sx={{ ml: 1 }}>Join the Patreon</Button>
								</Box>
							</Box>
					} />
				</>
			} />
			<Box sx={{ mb: 6 }} />
		</GridItemCentered>
	);
}