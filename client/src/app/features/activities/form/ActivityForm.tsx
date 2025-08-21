import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../../lib/hooks/useActivities";

type Props = {
    activity?: Activity;
    closeForm: () => void;
}

export default function ActivityForm({ activity, closeForm }: Props) {

    const { updateActivity, createActivity} = useActivities();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data: {[key: string]: FormDataEntryValue} = { }
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (activity) {
            data.id = activity.id; // Ensure the ID is included for updates
            await updateActivity.mutateAsync(data as unknown as Activity);
            closeForm();
        } else {
            await createActivity.mutateAsync(data as unknown as Activity);
            closeForm();
        }
    }

    return (
        <Paper sx={{ borderRadius: 2, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                Create Activity
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField name='title' label="Title" defaultValue={activity?.title} />
                <TextField name='description' label="Description" value={activity?.description} multiline rows={3} />
                <TextField name='category' label="Category" value={activity?.category} />
                <TextField name='date' label="Date" type="date" 
                    defaultValue={activity?.date
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                />
                <TextField name='city' label="City" value={activity?.city} />
                <TextField name='venue' label="Venue" value={activity?.venue} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                    <Button color="inherit" onClick={closeForm}> Cancel </Button>
                    <Button color="success" 
                    type="submit" 
                    variant="contained"
                    disabled={updateActivity.isPending || createActivity.isPending}> 
                    Submit 
                    </Button>
                </Box>
            </Box>

        </Paper>
    )
}