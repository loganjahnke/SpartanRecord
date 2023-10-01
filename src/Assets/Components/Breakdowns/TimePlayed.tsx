import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function TimePlayed(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch, small } = props;

	/**
	 * Gets the human readable time from the number of seconds
	 * @param seconds the number of seconds
	 * @returns human readable time
	 */
	const humanReadable = (seconds: number): string =>
	{
		const numdays = Math.floor((seconds % 31536000) / 86400); 
        let numhours: number | string = Math.floor(((seconds % 31536000) % 86400) / 3600);
        let numminutes: number | string = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
		
		if (numhours < 10) { numhours = "0" + numhours; }
		if (numminutes < 10) { numminutes = "0" + numminutes; }

        let daysStr = "";
        const timeStr = +numhours > 0 
            ? numhours + ":" + numminutes
            : "00:" + numminutes;

        if (numdays > 0)
        {
            daysStr = numdays + " days ";
        }

        return daysStr + timeStr;
	};


	return (
		<TitleCard title={small ? "" : "Time Played"} secondary={small}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile small={small} title="" tooltip="The total time played (Days Hours:Minutes)" value={showPerMatch ? humanReadable(serviceRecord.timePlayed.seconds / serviceRecord.matchesPlayed) : humanReadable(serviceRecord.timePlayed.seconds)} isMainStat />
			</Box>
		</TitleCard>
	);
}