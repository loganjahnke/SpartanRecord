import { FormControl, InputLabel, Input } from "@mui/material";

export function AHTextField(props: { label: string, value: string, autofocus?: boolean })
{
	const { label, value, autofocus } = props;

	return (
		<FormControl variant="standard">
			<InputLabel htmlFor={`lbl-${label}`} sx={{ color: "caption" }}>{label}</InputLabel>
			<Input id={`lbl-${label}`} value={value} autoFocus={autofocus} />
		</FormControl>
	);
}