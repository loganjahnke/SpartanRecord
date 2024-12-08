import React from "react";
import { Box, Typography } from "@mui/material";
import { AnimationProps } from "./AnimationProps";

/**
 * The inner component to animate into
 */
export const InnerAnimationBox = React.forwardRef(function (props: AnimationProps, ref)
{
	const { content, nested, ignoreBoxStyling } = props;

	return (
		<Box ref={ref} sx={ignoreBoxStyling ? {} : { backgroundColor: nested ? "transparent" : "divider", borderRadius: 3, display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "space-evenly", alignItems: "center", p: nested ? 0 : 2 }}>
			{typeof content === "string" 
				? <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: "1px" }}>{content}</Typography> 
				: content
			}
		</Box>
	);
})