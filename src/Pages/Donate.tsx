import { Box, Divider, Grid, Link, Toolbar, Typography } from "@mui/material";
import { ImageCardWithContent } from "../Assets/Components/Cards/ImageCardWithContent";

import banner from "../Assets/Images/Patreon/banner-tier-1.png";
import tier1 from "../Assets/Images/Patreon/banner-tier-2.png";
import { Grow } from "../Assets/Components/Common/Grow";

export function Donate()
{
	document.title = "Spartan Record | Donate";
	
	return (
		<Box component="main" sx={{ flexGrow: 1, height: {xs: "calc(100% - 24px)", md: "calc(100% - 32px)"}}}>
			<Toolbar />
			<Divider />
			<Box sx={{ 
				height: "100%", 
				backgroundPosition: "center", 
				overflow: "auto",
				backgroundSize: "cover", 
				backgroundImage: "url(https://blobs-infiniteugc.svc.halowaypoint.com/ugcstorage/playlist/73b48e1e-05c4-4004-927d-965549b28396/17b616fb-f128-46c9-b966-7850b38445f9/images/hero.png)", 
			}}>
				<Box sx={{ height: { xs: "auto", md: "100%" }, display: "flex", flexDirection: "column", backgroundColor: "rgba(1,64,82, 0.8)", textAlign: "center", overflow: "hidden" }}>
					<Grow />
					<Box sx={{ textAlign: "center" }}>
						<Box sx={{ mt: { xs: 20 }}}></Box>
						<Typography variant="h3" sx={{ textAlign: "center" }}>Donate</Typography>
						<Typography variant="h6" sx={{ textAlign: "center" }}>Help keep Spartan Record running</Typography>
						<Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
							<Grid item xs={10} md={3} lg={3} sx={{ m: 2 }}>
								<ImageCardWithContent image={banner}>
									<Typography variant="h5" sx={{ textAlign: "center" }}><Link href="https://www.paypal.com/donate/?hosted_button_id=FTQWP27P5JMPG">Donate with Paypal</Link></Typography>
									<Typography variant="body2" sx={{ textAlign: "center" }}>Do a one-time donation for SpartanRecord.com</Typography>
								</ImageCardWithContent>
							</Grid>
							<Grid item xs={10} md={3} lg={3} sx={{ m: 2 }}>
								<ImageCardWithContent image={tier1}>
									<Typography variant="h5" sx={{ textAlign: "center" }}><Link href="https://patreon.com/spartanrecord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link">Subscribe on Patreon</Link></Typography>
									<Typography variant="body2" sx={{ textAlign: "center" }}>Go ad-free and subscribe to SpartanRecord's Patreon</Typography>
								</ImageCardWithContent>
							</Grid>
						</Grid>
						<Box sx={{ mt: { xs: 20 }}}></Box>
					</Box>
					<Grow />
				</Box>
			</Box>
		</Box>
	);
}