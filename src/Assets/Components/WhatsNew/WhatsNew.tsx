import { Button, Card, CardActions, CardContent, List, Typography } from "@mui/material";
import { Feature } from "../../../Objects/Model/Feature";
import { WhatsNewItem } from "./WhatsNewItem";
import { Grow } from "../Common/Grow";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { SRTabs } from "../Layout/AHDrawer";

interface WhatsNewProps
{
	gamertag?: string;
	onDismiss(): void;
	switchTab: (url?: string, tab?: SRTabs) => void;
}

export function WhatsNew(props: WhatsNewProps)
{
	const { gamertag, onDismiss, switchTab } = props;

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

	features.set("4.10", [
		new Feature("Active Playlists redesign", "See the map and mode odds for a specific playlist"),
		new Feature("Patreon", "Consider subscribing to help keep SpartanRecord running!"),
	]);

	features.set("4.11", [
		new Feature("Firefight", "Review Firefight match summaries"),
		new Feature("Match Summary CSR Leaders", "See the lobby's CSR leaders from top to bottom in the match summary"),
		new Feature("Patreon", "Consider subscribing to help keep SpartanRecord running!"),
	]);

	features.set("4.12", [
		new Feature("Extended Firefight Stats", "Review Firefight match summaries in extra detail + view your Firefight stats in your Service Record"),
		new Feature("Patreon", "Consider subscribing to help keep SpartanRecord running!", "subscribe"),
	]);

	features.set("4.13", [
		new Feature("Ranked Arena Leaderboard", "See the top 100 players in Ranked Arena with our new leaderboards page", "leaderboard/edfef3ac-9cbe-4fa2-b949-8f29deafd483"),
		new Feature("Extended Firefight Stats", "Review Firefight match summaries in extra detail + view your Firefight stats in your Service Record"),
		new Feature("Patreon", "Consider subscribing to help keep SpartanRecord running!", "subscribe"),
	]);

	features.set("4.14", [
		new Feature("Your Great Journey to Hero", "Set a goal date and see how many games you need play per day to achieve the Hero rank"),
		new Feature("Ranked Arena Leaderboard", "See the top 100 players in Ranked Arena with our new leaderboards page", "leaderboard/edfef3ac-9cbe-4fa2-b949-8f29deafd483"),
		new Feature("Patreon", "Subscribe to go ad-free for your gamertag", "subscribe"),
	]);

	features.set("4.15", [
		new Feature("Your Great Journey to Hero (Alternate Mode)", "Set your games / day and see what date you will hit Hero"),
		new Feature("Multi-Team Support", "View multi-team match summaries"),
		new Feature("Patreon", "Subscribe to go ad-free for your gamertag", "subscribe"),
	]);

	return (
		<Card sx={{ background: ArrowheadTheme.card + "DD" }}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700 }}>What's new?</Typography>
				<List>
					{features.get(process.env.REACT_APP_MAJOR_VERSION || "47")?.map(feature => <WhatsNewItem feature={feature} onJump={switchTab} />)}
				</List>
			</CardContent>
			<CardActions>
				<Grow />
				<Button variant="outlined" onClick={() => switchTab(`subscribe/${gamertag}`, SRTabs.Subscribe)}>Donate</Button>
				<Button variant="contained" onClick={onDismiss}>Dismiss</Button>
			</CardActions>
		</Card>
	);
}