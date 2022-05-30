import { Box, Divider, Grid, Link, Toolbar, Typography } from "@mui/material";

import { ViewProps } from "./Props/ViewProps";
import { ImageCardWithContent } from "../Assets/Components/Cards/ImageCardWithContent";

export function OtherCreators()
{
	document.title = "Spartan Record | Powered by HaloDotAPI";
	
	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 32px)" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column", pt: 3, pb: 3 }}>
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ backgroundColor: "secondary.main", textAlign: "center" }}>
					<Typography variant="h6" sx={{ textAlign: "center" }}>Powered by HaloDotAPI</Typography>
					<Grid container sx={{ justifyContent: "center", alignItems: "center" }}>
						<Grid item xs={8} md={3} lg={2} sx={{ m: 2 }}>
							<ImageCardWithContent image="https://spartanrecord.com/images/haloinfo.png">
								<Typography variant="h6" sx={{ textAlign: "center" }}><Link href="https://halo.info">halo.info</Link></Typography>
								<Typography variant="body2" sx={{ textAlign: "center" }}>Created by <Link href="https://twitter.com/threesided">threesided</Link></Typography>
							</ImageCardWithContent>
						</Grid>
						<Grid item xs={8} md={3} lg={2} sx={{ m: 2 }}>
							<ImageCardWithContent image="https://spartanrecord.com/images/halodatahive.png">
								<Typography variant="h6" sx={{ textAlign: "center" }}><Link href="https://halodatahive.com">Halo Data Hive</Link></Typography>
								<Typography variant="body2" sx={{ textAlign: "center" }}>Created by <Link href="https://twitter.com/HaloDataHive">HaloDataHive</Link></Typography>
							</ImageCardWithContent>
						</Grid>
						<Grid item xs={8} md={3} lg={2} sx={{ m: 2 }}>
							<ImageCardWithContent image="https://spartanrecord.com/images/leafapp.png">
								<Typography variant="h6" sx={{ textAlign: "center" }}><Link href="https://leafapp.co">Leaf App</Link></Typography>
								<Typography variant="body2" sx={{ textAlign: "center" }}>Created by <Link href="https://twitter.com/iBotPeaches">iBotPeaches</Link></Typography>
							</ImageCardWithContent>
						</Grid>
					</Grid>
				</Box>
				<Box sx={{ flexGrow: 1 }} />
			</Box>
		</Box>
	);
}