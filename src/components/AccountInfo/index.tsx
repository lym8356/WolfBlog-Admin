import { Box, Card, CardContent, Typography } from "@mui/material"
import { User } from "../../models/user";

interface Props {
    user: User | null
}

export const AccountInfo: React.FC<Props> = ({ user }) => {
    const isAdmin = user?.roles?.includes("Admin");
    return (
        <Card
            sx={{ 
                display: 'flex',
                // height: '15vh',
                height: '140px',
                ':hover': {
                    boxShadow: 10
                }
            }}
            elevation={4}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <CardContent>
                    <Typography variant="h5">
                       Welcome to Wolfy Blog Admin!
                    </Typography>
                    <Typography variant="h6" marginTop={2}>
                        You are logged in as <span style={{color: '#1890FF'}}>{user?.displayName}</span>
                    </Typography>
                    <Typography variant="h6" color={isAdmin ? '#1890FF' : 'red'}>
                        {user?.bio}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )
}