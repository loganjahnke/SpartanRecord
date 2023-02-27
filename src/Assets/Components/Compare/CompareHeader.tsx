import { Box } from "@mui/material";
import { ReactElement } from "react";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface CompareHeaderProps
{
	changeButton?: ReactElement;
	compare1?: ReactElement;
	compare2?: ReactElement;
	icon?: ReactElement;
	stretch?: boolean;
}

export function CompareHeader(props: CompareHeaderProps)
{
	const { changeButton, compare1, compare2, icon, stretch } = props;

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: ArrowheadTheme.secondary, maxWidth: stretch ? "none" : "800px", width: "100%", borderRadius: "12px 12px 0 0" }}>
			{changeButton}
			<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2,  mb: 2, width: "100%" }}>
				<Box sx={{ width: "calc(50% - 50px)", flexGrow: 1 }}>{compare1}</Box>
				<Box sx={{ width: "50px", textAlign: "center" }}>{icon}</Box>
				<Box sx={{ width: "calc(50% - 50px)", flexGrow: 1 }}>{compare2}</Box>
			</Box>
		</Box>
	);
}