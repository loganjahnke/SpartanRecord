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
	backgroundURL?: string;
	subtitle?: ReactElement;
}

export function CompareHeader(props: CompareHeaderProps)
{
	const { changeButton, compare1, compare2, icon, stretch, backgroundURL, subtitle } = props;

	return (

		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: backgroundURL ?? ArrowheadTheme.secondary, backgroundPosition: "center", backgroundSize: "cover", maxWidth: stretch ? "none" : "800px", width: "100%", borderRadius: "12px 12px 0 0" }}>
			<Box sx={{ width: "100%", height: "100%", backgroundColor: "rgba(20,43,51, 0.75)" }}>
				{changeButton}
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2,  mb: 2, width: "100%" }}>
					<Box sx={{ width: "calc(50% - 50px)", flexGrow: 1 }}>{compare1}</Box>
					<Box sx={{ width: "50px", textAlign: "center" }}>{icon}</Box>
					<Box sx={{ width: "calc(50% - 50px)", flexGrow: 1 }}>{compare2}</Box>
				</Box>
				<Box sx={{ width: "100%", textAlign: "center", pb: 2 }}>
					{subtitle}
				</Box>
			</Box>
		</Box>
	);
}