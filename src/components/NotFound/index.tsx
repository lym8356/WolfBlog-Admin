import { Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Link } from "react-router-dom"

export const NotFound: React.FC = () => {
    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: "1000px",
                    marginLeft: '220px',
                    marginTop: '100px',
                    '& > *': {
                        margin: "10px 0px"
                    }
                }}
            >
                <Typography variant="h1">
                    404
                </Typography>
                <Typography variant="h4">
                    The page you're looking for doesn't exist
                </Typography>
                <Link to="/admin" >
                    <Button variant="contained"
                        sx={{
                            color: 'secondary.main',
                            backgroundColor: 'primary.main',
                            ':hover': {
                                color: 'primary.main',
                                backgroundColor: 'secondary.light',
                            }
                        }}
                    >
                        Back To Home
                    </Button>
                </Link>
                <Box
                    component="img"
                    src="/assets/notfound.png"
                    sx={{
                        width: "350px",
                        height: "350px"
                    }}
                />
            </Box>
        </>
    )
}