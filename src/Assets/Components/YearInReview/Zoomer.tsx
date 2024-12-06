import { Zoom, Typography, Box } from "@mui/material";
import React from "react";

interface ZoomerProps
{
	content: string | JSX.Element | JSX.Element[];
	duration?: string;
	delay?: string;
	zoom?: boolean;
	removeBottomPadding?: boolean;
}

interface InnerZoomerProps
{
	content: string | JSX.Element | JSX.Element[];
	style?: any;
	removeBottomPadding?: boolean;
}

/**
 * A component to wrap text around a zoom animation
 */
export function Zoomer(props: ZoomerProps)
{
	const { content, duration = "2s", delay, zoom, removeBottomPadding } = props;

	return (
		<Zoom in={zoom} style={{ transitionDelay: delay, transitionDuration: duration }}>
			<InnerZoom content={content} removeBottomPadding={removeBottomPadding} />
		</Zoom>
	);
}

/**
 * The inner component to zoom into
 */
const InnerZoom = React.forwardRef(function (props: InnerZoomerProps, ref)
{
	const { content, removeBottomPadding } = props;

	let withoutContent = { style: props.style };

	return (
		<Box ref={ref} {...withoutContent} sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "space-evenly", alignItems: "center", p: 2, pb: removeBottomPadding ? 0 : 2 }}>
			{typeof content === "string" 
				? <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: "1px" }}>{content}</Typography> 
				: content
			}
		</Box>
	);
})