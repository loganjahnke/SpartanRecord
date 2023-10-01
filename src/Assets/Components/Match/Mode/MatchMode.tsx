import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { CTFSchema, OddballSchema, ZoneSchema, EliminationSchema, StockpileSchema } from "../../../../Database/Schemas/ServiceRecordSchema";
import { CTFMode } from "./CTFMode";
import { OddballMode } from "./OddballMode";
import { ZoneMode } from "./ZoneMode";

interface MatchModeProps
{
	mode?: CTFSchema | OddballSchema | ZoneSchema | EliminationSchema | StockpileSchema;
}

export function MatchMode(props: MatchModeProps)
{
	const { mode } = props;

	if (!mode) { return <></>; }

	if (mode.hasOwnProperty("flag_captures"))
	{
		return <CTFMode mode={mode as CTFSchema} />
	}

	if (mode.hasOwnProperty("kills_as_skull_carrier"))
	{
		return <OddballMode mode={mode as OddballSchema} />
	}

	if (mode.hasOwnProperty("stronghold_occupation_time"))
	{
		return <ZoneMode mode={mode as ZoneSchema} />
	}

	return <></>;
}