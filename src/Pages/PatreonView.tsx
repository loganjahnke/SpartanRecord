import { Box, Card, CardContent, CardMedia, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";

export function PatreonView(props: ViewProps)
{
	//#region Props and Navigate
	const { isAllowed } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	
	//#endregion

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 64px)" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start", p: 4 }}>
				{isAllowed && 
				<>
					<Typography variant="h3">Thank you for supporting Spartan Record!</Typography>
					<Typography variant="h6">{gamertag} has access to additional features</Typography>
				</>}
				{!isAllowed && <>
					<Typography variant="h3">Support Spartan Record</Typography>
					<Typography variant="h6">Subscribe to our Patreon to gain access to additional features!</Typography>
				</>}
				<Grid container spacing={8} sx={{ mt: 8, pl: 4, pr: 4 }}>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia component="img" image="BestMatches.png" />
							<CardContent>
								<Typography variant="body1">
									Drilldown into your service record even further. See service record by map, mode, and match outcome
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia>

							</CardMedia>
							<CardContent>
								<Typography variant="body1">
									View the best (and worst) matches of your career
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia>

							</CardMedia>
							<CardContent>
								<Typography variant="body1">
									View your historical statistics and see how your performance has shaped over time
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}