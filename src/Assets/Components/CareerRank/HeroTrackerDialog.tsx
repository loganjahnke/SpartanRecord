import { useCallback, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { CareerRankSchema } from "../../../Database/Schemas/CareerRankSchema";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { CareerRankMetadata } from "../../../Database/Schemas/AutocodeMetadata";
import { CareerRankProgressionColumnTile } from "./CareerRankProgressionColumnTile";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Cookie } from "../../../Objects/Helpers/Cookie";

import moment from "moment";

interface HeroTrackerDialogProps
{
	open: boolean;
	rank: CareerRankSchema;
	allRanks: CareerRankMetadata[];
	avgScore: number;
	isSubscribedToPatreon?: boolean
	close: () => void;
}

export function HeroTrackerDialog(props: HeroTrackerDialogProps)
{
	const { open, rank, allRanks, avgScore, isSubscribedToPatreon, close } = props;

	const [goalDate, setGoalDate] = useState<moment.Moment | null>(Cookie.getHeroTrackerGoalDate() ?? moment().add(1, "years"));

	const goalDateChanged = useCallback((newGoal: moment.Moment | null) => 
	{
		if (newGoal) { Cookie.setHeroTrackerGoalDate(newGoal); }
		setGoalDate(newGoal);
	}, [setGoalDate]);

	if (!allRanks || allRanks.length === 0) { return <></>; }

	const xpToRank = allRanks[allRanks.length - 1].properties.threshold - rank.data.level.total_xp;
	const matchesToHero = Math.ceil(xpToRank / Math.max(avgScore, 1));
	const daysBetweenGoalAndToday = goalDate?.isValid() ? goalDate.diff(moment(), "days") + 1 : 0;

	return (
		<Dialog open={!!open} onClose={close}>
			<DialogTitle sx={{ color: ArrowheadTheme.text_primary, backgroundColor: ArrowheadTheme.secondary }}>Your Great Journey to Hero</DialogTitle>		
			<DialogContent sx={{ backgroundColor: ArrowheadTheme.box }}>
				<CareerRankProgressionColumnTile rank={allRanks[allRanks.length - 1]} current={rank} avgScore={avgScore} />
				<Box sx={{ mt: 4, maxWidth: "255px", textAlign: "center" }}>
					<LocalizationProvider dateAdapter={AdapterMoment}>
						<DatePicker label="Goal" value={goalDate} onChange={goalDateChanged} />
					</LocalizationProvider>
					{daysBetweenGoalAndToday && goalDate && goalDate.isValid() && 
						<>
							<Typography sx={{ mt: 3, mb: -0.5 }} variant="subtitle1">You need to play</Typography>
							<Typography variant="h5">{Math.ceil(matchesToHero / daysBetweenGoalAndToday).toLocaleString()} games / day</Typography>
							<Typography variant="subtitle1">to reach Hero by your goal date</Typography>
						</>
					}
					{xpToRank && goalDate && goalDate.isValid() && 
						<>
							<Typography sx={{ mt: 3, mb: -0.5 }} variant="subtitle1">You need to average</Typography>
							<Typography variant="h5">{Math.ceil(xpToRank / daysBetweenGoalAndToday).toLocaleString()} XP / day</Typography>
							<Typography variant="subtitle1">to reach Hero by your goal date</Typography>
						</>
					}
				</Box>
			</DialogContent>
			<DialogActions sx={{ backgroundColor: ArrowheadTheme.box }}>
				<Button variant="outlined" onClick={close}>Done</Button>
			</DialogActions>
		</Dialog>
	);
}