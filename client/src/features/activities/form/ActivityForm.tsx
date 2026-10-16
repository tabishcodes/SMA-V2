import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";

// 1. The list of dropdown options
const categoryOptions = [
    { text: 'Drinks', value: 'drinks' },
    { text: 'Culture', value: 'culture' },
    { text: 'Film', value: 'film' },
    { text: 'Food', value: 'food' },
    { text: 'Music', value: 'music' },
    { text: 'Travel', value: 'travel' },
];

export default function ActivityForm() {
    const { id } = useParams();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data: { [key: string]: FormDataEntryValue } = {}
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (activity) {
            data.id = activity.id; // Ensure the ID is included for updates
            await updateActivity.mutateAsync(data as unknown as Activity);
            navigate(`/activities/${activity.id}`);
        } else {
            createActivity.mutate(data as unknown as Activity, {
                onSuccess: (id) => {
                    navigate(`/activities/${id}`)
                }
            }
            );
        }
    }

    if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

    return (
        <Paper sx={{ borderRadius: 2, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    name='title'
                    label="Title"
                    defaultValue={activity?.title}
                />

                <TextField
                    name='description'
                    label="Description"
                    value={activity?.description}
                    multiline
                    rows={3}
                />

                <TextField
                    select
                    name='category'
                    label="Category"
                    defaultValue={activity?.category || ''}
                >
                    {categoryOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.text}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    name='date'
                    label="Date"
                    type="date"
                    defaultValue={activity?.date
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                />
                <TextField
                    name='city'
                    label="City"
                    value={activity?.city}
                />
                <TextField
                    name='venue'
                    label="Venue"
                    value={activity?.venue}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                    <Button color="inherit" > Cancel </Button>
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