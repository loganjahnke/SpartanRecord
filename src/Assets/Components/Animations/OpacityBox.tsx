import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { AnimationProps } from "./Shared/AnimationProps";
import { InnerAnimationBox } from "./Shared/InnerAnimationBox";

/**
 * A component to wrap a component around an opacity animation
 */
export function OpacityBox(props: AnimationProps)
{
	const { duration = "2s", delay = "250ms", nested } = props;

	const [opacity, setOpacity] = useState(0);
	const [hidden, setHidden] = useState(nested);

	useEffect(() =>
	{
		const timeoutId = setTimeout(() =>
		{
			setHidden(false);
			setOpacity(1);
		}, parseInt(delay));

		return () => clearTimeout(timeoutId);
	}, []); // eslint-disable-line

	return (
		<Box style={{ width: "100%", opacity: opacity, visibility: hidden ? "hidden" : "visible", transition: "opacity ease-in-out", transitionDuration: duration }}>
			<InnerAnimationBox {...props} />
		</Box>
	);
}