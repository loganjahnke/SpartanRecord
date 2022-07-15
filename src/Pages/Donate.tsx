import { Box, Divider, Grid, Link, Toolbar, Typography } from "@mui/material";
import { ImageCardWithContent } from "../Assets/Components/Cards/ImageCardWithContent";

import banner from "../Assets/Images/Patreon/banner.png";

export function Donate()
{
	document.title = "Spartan Record | Donate";
	
	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 32px)" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", pt: 3, pb: 3 }}>
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ backgroundColor: "secondary.main", textAlign: "center" }}>
					<Typography variant="h6" sx={{ textAlign: "center" }}>Donate</Typography>
					<Typography variant="caption" sx={{ textAlign: "center" }}>Help keep Spartan Record and HaloDotAPI running</Typography>
					<Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
						<Grid item xs={10} md={3} lg={3} sx={{ m: 2 }}>
							<ImageCardWithContent image={banner}>
								<Typography variant="h6" sx={{ textAlign: "center" }}><Link href="https://www.paypal.com/donate/?hosted_button_id=FTQWP27P5JMPG">Donate with Paypal</Link></Typography>
								<Typography variant="body2" sx={{ textAlign: "center" }}>Do a one-time donation for SpartanRecord.com</Typography>
							</ImageCardWithContent>
						</Grid>
						<Grid item xs={10} md={3} lg={3} sx={{ m: 2 }}>
							<ImageCardWithContent image="https://spartanrecord.com/images/haloinfo.png">
								<Typography variant="h6" sx={{ textAlign: "center" }}><Link href="https://autocode.com/halo/subscribe/">Subscribe to HaloDotAPI</Link></Typography>
								<Typography variant="body2" sx={{ textAlign: "center" }}>Help keep HaloDotAPI alive by subscribing as a supporter</Typography>
							</ImageCardWithContent>
						</Grid>
					</Grid>
				</Box>
				<Box sx={{ flexGrow: 1 }} />
			</Box>
		</Box>
	);
}