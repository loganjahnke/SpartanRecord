import { Grid } from "@mui/material";

interface GridItemCenteredProps
{
	children?: JSX.Element | JSX.Element[];
}

export const GridItemCentered = function (props: GridItemCenteredProps)
{
	const { children } = props;

	return (
		<>
			<Grid item xs={0} sm={0} md={3} xl={4} />
			<Grid item xs={12} md={6} xl={4}>
				{children}
			</Grid>
			<Grid item xs={0} sm={0} md={3} xl={4} />
		</>
	);
};

