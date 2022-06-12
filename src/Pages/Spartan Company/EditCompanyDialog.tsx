import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MedalTypeBreakdown } from "../../Assets/Components/Medals/MedalTypeBreakdown";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { SpartanCompany } from "../../Objects/Model/SpartanCompany";

interface EditCompanyDialogProps
{
	open: boolean;
	loading: boolean;
	cancel: () => void;
	accept: (name: string, medal: number) => void;
	spartanCompany: SpartanCompany;
	sharedSR: ServiceRecord;
}

export function EditCompanyDialog(props: EditCompanyDialogProps)
{
	const { open, cancel, accept, loading, spartanCompany, sharedSR } = props;

	const [spartanCompanyName, setSpartanCompanyName] = useState(spartanCompany.name);
	const [spartanCompanyMedal, setSpartanCompanyMedal] = useState(spartanCompany.medalID);

	/** Controlled search component */
	function onCompanyNameValueChange(event: React.ChangeEvent<HTMLInputElement>): void
	{
		setSpartanCompanyName(event.target.value);
	};

	/**
	 * Sets the spartan company medal
	 * @param medalID the medal ID
	 */
	function selectMedal(medalID: number): void
	{
		setSpartanCompanyMedal(medalID);
	}

	useEffect(() =>
	{
		setSpartanCompanyName(spartanCompany.name);
		setSpartanCompanyMedal(spartanCompany.medalID)
	}, [spartanCompany]);

	return (
		<Dialog open={open} onClose={cancel}>
			<DialogTitle sx={{ color: ArrowheadTheme.text_primary, backgroundColor: ArrowheadTheme.secondary }}>Modify your Spartan Company</DialogTitle>		
			<DialogContent sx={{ backgroundColor: ArrowheadTheme.box }}>
				<Box sx={{ backgroundColor: "transparent", height: "100%", p: 1 }}>
					<Box sx={{ mt: 3 }}>
						<Typography variant="body1" sx={{ color: "primary.main" }}>Spartan Company Name</Typography>
						<TextField variant="outlined" size="small" sx={{ width: "90%", mt: 2 }} value={spartanCompanyName} onChange={onCompanyNameValueChange} disabled={loading} />
					</Box>
					<Box sx={{ mt: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography variant="body1" sx={{ color: "primary.main" }}>Choose a Spartan Company Emblem</Typography>
						</Box>
						<MedalTypeBreakdown select={selectMedal} selectedID={spartanCompanyMedal} medals={sharedSR.medals} />
					</Box>
				</Box>
			</DialogContent>
			<DialogActions sx={{ backgroundColor: ArrowheadTheme.box }}>
				<Button onClick={cancel}>Cancel</Button>
				<LoadingButton loading={loading} onClick={() => accept(spartanCompanyName, spartanCompanyMedal)} autoFocus>Accept</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}