import { Link, Typography } from "@mui/material"
import { Box } from "@mui/system"


export const Footer : React.FC = () => {
    return (
        <Box component="footer" sx={{ 
                bgcolor: 'primary.main', 
                width: '100%', 
                bottom: 0, 
                position: 'fixed',
                height: "5vh",
                marginLeft: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
            <Typography variant="body2" color="secondary.main" align="center" marginLeft={10}>
                Wolfy Blog Admin ©&nbsp;2022 Created by lym8356
            </Typography>
            <Typography variant="body2" color="secondary.main" align="center" marginLeft={10}>
                Source Code &nbsp;
                <Link color="inherit" href="https://github.com/lym8356/WolfBlog-Admin">
                    GitHub
                </Link>
            </Typography>
        </Box>
    )
}