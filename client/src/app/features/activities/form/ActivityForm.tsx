import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";

type Props = {
    activity?: Activity;
    closeForm: () => void;
    submitForm: (activity: Activity) => void;
}

export default function ActivityForm({ activity, closeForm, submitForm }: Props) {

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data: {[key: string]: FormDataEntryValue} = { }
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (activity) data.id = activity.id;

        submitForm(data as unknown as Activity);
    }

    return (
        <Paper sx={{ borderRadius: 2, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                Create Activity
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField name='title' label="Title" value={activity?.title} />
                <TextField name='description' label="Description" value={activity?.description} multiline rows={3} />
                <TextField name='category' label="Category" value={activity?.category} />
                <TextField name='date' label="Date" type="date" value={activity?.date?.split("T")[0]} />
                <TextField name='city' label="City" value={activity?.city} />
                <TextField name='venue' label="Venue" value={activity?.venue} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                    <Button color="inherit" onClick={closeForm}> Cancel </Button>
                    <Button color="success" type="submit" variant="contained"> Submit </Button>
                </Box>
            </Box>

        </Paper>
    )
}