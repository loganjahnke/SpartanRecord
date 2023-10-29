import { Button, Card, CardActions, CardContent, List, Typography } from "@mui/material";
import { Feature } from "../../../Objects/Model/Feature";
import { WhatsNewItem } from "./WhatsNewItem";
import { Grow } from "../Common/Grow";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { SRTabs } from "../Layout/AHDrawer";

interface WhatsNewProps
{
	onDismiss(): void;
	switchTab: (url?: string, tab?: SRTabs) => void;
}

export function WhatsNew(props: WhatsNewProps)
{
	const { onDismiss, switchTab } = props;

	const features: Map<string, Feature[]> = new Map();

	features.set("48", [
		new Feature("This What's New section!", "Not a fan? You can dismiss it."),
		new Feature("Three new extraction medals", "Clear Reception, Call Blocked, and Hang Up"),
		new Feature("Patreon", "Consider subscribing to help keep SpartanRecord running!"),
	]);

	features.set("49", [
		new Feature("Infection post-match summary", "See the amount of times you were alpha zombie"),
		new Feature("Game mode breakdowns", "See the game mode breakdowns directly on the Service Record page"),
		new Feature("Infection mode breakdown", "See your career infection breakdowns"),
		new Feature("Extraction mode breakdown", "See your career extraction breakdowns"),
		new Feature("Bug fixes", "Career Rank and CSR bug fixes"),
		new Feature("Patreon", "Consider subscribing to help keep SpartanRecord running!"),
	]);

	return (
		<Card sx={{ background: ArrowheadTheme.card + "DD" }}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700 }}>What's new?</Typography>
				<List>
					{features.get(process.env.REACT_APP_MAJOR_VERSION || "47")?.map(feature => <WhatsNewItem feature={feature} />)}
				</List>
			</CardContent>
			<CardActions>
				<Grow />
				<Button variant="outlined" onClick={() => switchTab(`donate`, SRTabs.Donate)}>Donate</Button>
				<Button variant="contained" onClick={onDismiss}>Dismiss</Button>
			</CardActions>
		</Card>
	);
}