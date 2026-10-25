import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";
import type { Activity } from "../../../lib/types";


export default function ActivityForm() {
    const { reset, control, handleSubmit } = useForm<z.input<typeof activitySchema>, undefined, ActivitySchema>({
        mode: 'onTouched',
        resolver: zodResolver(activitySchema)
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);

    useEffect(() => {
        if (activity) {
            reset({
                ...activity,
                location: {
                    city: activity.city,
                    venue: activity.venue,
                    latitude: activity.latitude,
                    longitude: activity.longitude
                }
            });
        }
    }, [activity, reset]);

    const onSubmit = async (data: ActivitySchema) => {
        const { location, ...rest } = data;
        const flattenedData = { ...rest, ...location };

        try {
            if (activity) {
                await updateActivity.mutateAsync({ ...activity, ...flattenedData });
                navigate(`/activities/${activity.id}`);
            } else {
                const id = await createActivity.mutateAsync(flattenedData as unknown as Activity);

                console.log("Returned ID:", id); // 👈 Check your browser console!

                // If it prints [object Object], you need to access id.id or id.data
                // If it's a valid string (e.g., "b3a4..."), this navigate will work perfectly:
                if (id) {
                    navigate(`/activities/${id}`);
                }
            }
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

    return (
        <Paper sx={{ borderRadius: 2, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'}
            </Typography>

            <Box component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >

                <TextInput
                    label="Title"
                    control={control}
                    name="title"
                />

                <TextInput
                    label="Description"
                    control={control}
                    name="description"
                    multiline
                    rows={3}
                />

                <Box sx={{ display: 'flex', gap: 3 }}>
                    <SelectInput
                        items={categoryOptions}
                        label="Category"
                        control={control}
                        name="category"
                    />

                    <DateTimeInput
                        label="Date"
                        control={control}
                        name="date"
                    />
                </Box>

                <LocationInput
                    control={control}
                    name="location"
                    label="Location"
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
