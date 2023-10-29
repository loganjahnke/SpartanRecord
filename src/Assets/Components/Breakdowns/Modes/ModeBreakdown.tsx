import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { TitleCard } from "../../Cards/TitleCard";
import { BreakdownProps } from "../BreakdownTile";
import { useState } from "react";
import { CaptureTheFlagBreakdown } from "./CaptureTheFlagBreakdown";
import { StockpileBreakdown } from "./StockpileBreakdown";
import { EliminationBreakdown } from "./EliminationBreakdown";
import { ZoneBreakdown } from "./ZoneBreakdown";
import { OddballBreakdown } from "./OddballBreakdown";
import { ExtractionBreakdown } from "./ExtractionBreakdown";
import { InfectionBreakdown } from "./InfectionBreakdown";

export function ModeBreakdown(props: BreakdownProps)
{
	const [mode, setMode] = useState<string>("CTF");

	/**
	 * When the select is changed
	 * @param event event
	 */
	function handleModeChange(event: SelectChangeEvent<HTMLElement>)
	{
		let element = event.target.value as string;
		if (element === "All") { element = ""; }
		setMode(element as any as string);
	}

	let breakdown: JSX.Element;

	switch (mode)
	{
		case "CTF": 
			breakdown = <CaptureTheFlagBreakdown {...props} />;
			break;
		case "Oddball": 
			breakdown = <OddballBreakdown {...props} />;
			break;
		case "Zones": 
			breakdown = <ZoneBreakdown {...props} />;
			break;
		case "Elimination": 
			breakdown = <EliminationBreakdown {...props} />;
			break;
		case "Stockpile": 
			breakdown = <StockpileBreakdown {...props} />;
			break;
		case "Infection": 
			breakdown = <InfectionBreakdown {...props} />;
			break;
		case "Extraction": 
			breakdown = <ExtractionBreakdown {...props} />;
			break;
		default:
			breakdown = <></>;
			break;
	}

	return (
		<TitleCard>
			<Box sx={{ mt: 2 }}>
				<FormControl size="small">
					<InputLabel>Game Mode</InputLabel>
					<Select value={(mode as any) as HTMLElement} label="Game Mode" onChange={handleModeChange}>
						<MenuItem value={"CTF"}>Capture the Flag</MenuItem>
						<MenuItem value={"Oddball"}>Oddball</MenuItem>
						<MenuItem value={"Zones"}>Zones</MenuItem>
						<MenuItem value={"Elimination"}>Elimination</MenuItem>
						<MenuItem value={"Stockpile"}>Stockpile</MenuItem>
						<MenuItem value={"Infection"}>Infection</MenuItem>
						<MenuItem value={"Extraction"}>Extraction</MenuItem>
					</Select>
				</FormControl>
			</Box>
			{breakdown}
		</TitleCard>
	);
}