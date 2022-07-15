import { Box, Card, CardContent, CardMedia, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";

import tier1 from "../Assets/Images/Patreon/banner-tier-1.png";
import tier2 from "../Assets/Images/Patreon/banner-tier-2.png";
import tier3 from "../Assets/Images/Patreon/banner-tier-3.png";
import { BestMatchIcon, MapIcon, MatchOutcomeIcon, PatreonIcon, ServiceRecordIcon, VariantsIcon } from "../Assets/Icons/CustomIcons";

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
							<CardMedia component="img" image={tier1} />
							<CardContent>
								<Typography variant="h6">
									Drilldown into your service record even further
								</Typography>
								<List>
									<ListItem>
										<ListItemIcon>
											<MapIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by map" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<VariantsIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by advanced variants such as Slayer BRs" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<MatchOutcomeIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by outcome, see how your performance is during wins or losses" />
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia component="img" image={tier2} />
							<CardContent>
								<Typography variant="h6">
									View your historic service record
								</Typography>
								<List>
									<ListItem>
										<ListItemIcon>
											<MapIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by map" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<VariantsIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by advanced variants such as Slayer BRs" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<MatchOutcomeIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by outcome, see how your performance is during wins or losses" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<ServiceRecordIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="See your performance over time with historical service records" />
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia component="img" image={tier3} />
							<CardContent>
								<Typography variant="h6">
									Receive a callout on SpartanRecord.com and view your best matches of all time
								</Typography>
								<List>
									<ListItem>
										<ListItemIcon>
											<MapIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by map" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<VariantsIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by advanced variants such as Slayer BRs" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<MatchOutcomeIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Filter by outcome, see how your performance is during wins or losses" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<ServiceRecordIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="See your performance over time with historical service records" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<BestMatchIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="View your best matches of all time" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<PatreonIcon />
										</ListItemIcon>
										<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Receive a callout on the SpartanRecord.com website" />
									</ListItem>
								</List>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}