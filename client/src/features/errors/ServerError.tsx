import { Divider, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useLocation } from "react-router";

export default function ServerError() {
    const { state } = useLocation();

    return (
        <Paper>
            {state.error ? (
                <>
                    <Typography gutterBottom variant="h3" sx={{ px: 4, pt: 2 }} color="secondary">
                        {state.error?.message || "Server Error"}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{ px: 4 }}>
                        {state.error?.details || "Internal Server Error"}
                    </Typography>
                </>
            ) : (
                <Typography variant="h5">Server Error</Typography>
            )}
        </Paper>
    );
}