import { Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams } from "react-router";
import { useForm, type FieldValues } from "react-hook-form";
import { useEffect } from "react";

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
    const { register, reset, handleSubmit } = useForm();
    const { id } = useParams();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);

    useEffect(() => {
        if (activity) {
            reset(activity);
        }
    }, [activity, reset]);

    const onSubmit = (data: FieldValues) => {
        console.log('Form submitted', data);
        
    }

    if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

    return (
        <Paper sx={{ borderRadius: 2, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    {...register('title')}
                    label="Title"
                    defaultValue={activity?.title}
                />

                <TextField
                    {...register('description')}
                    label="Description"
                    value={activity?.description}
                    multiline
                    rows={3}
                />

                <TextField
                    select
                    {...register('category')}
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
                    {...register('date')}
                    label="Date"
                    type="date"
                    defaultValue={activity?.date
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                />
                <TextField
                    {...register('city')}
                    label="City"
                    value={activity?.city}
                />
                <TextField
                    {...register('venue')}
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
