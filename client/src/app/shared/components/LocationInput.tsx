import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";
import type { LocationIQAddress } from "../../../lib/types";
import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Props<T extends FieldValues> = {
    label: string;
} & UseControllerProps<T>

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQAddress[]>([]);
    const [inputValue, setInputValue] = useState(field.value || '');

    useEffect(() => {
        if (field.value && typeof field.value === 'object') {
            setInputValue(field.value.venue || '');
        } else {
            setInputValue(field.value || '');
        }
    }, [field.value]);

    const locationUrl = "https://api.locationiq.com/v1/autocomplete?key=pk.33a11e48f946d305c5ba1041ecf44526&limit=5&dedupe=1&";

    const fetchSuggestions = useMemo(
        () => debounce(async (query: string) => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }
            setLoading(true);

            try {
                const res = await axios.get<LocationIQAddress[]>(`${locationUrl}q=${query}`);
                setSuggestions(res.data);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            } finally {
                setLoading(false);
            }

        }, 500), [locationUrl]
    );

    const handleChange = async (value: string) => {
        field.onChange(value);
        await fetchSuggestions(value);
    }

    const handleSelect = (location: LocationIQAddress) => {
        const address = location.address;

        // Search all potential fields, falling back to the first segment of the display name
        const city =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.suburb ||
            address?.state ||
            address?.country ||
            location.display_name.split(',')[0].trim();

        const venue = location.display_name;
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);

        setInputValue(venue);

        field.onChange({
            city: city || 'Unknown',
            venue,
            latitude,
            longitude
        });

        setSuggestions([]);
    };

    return (
        <Box>
            <TextField
                {...props}
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
            />
            {loading && <Typography>Loading...</Typography>}
            {suggestions.length > 0 && (
                <List sx={{ border: 1 }}>
                    {suggestions.map(suggestion => (
                        <ListItemButton
                            divider
                            key={suggestion.place_id}
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.display_name}
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    )
}