import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingComponent() {
    return (
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={80} color='inherit' />
                <Typography variant='h5' sx={{ justifyContent: 'center', position: 'fixed', top: '60%' }}>
                    Loading...
                </Typography>
            </Box>
        </Backdrop>
    )
}