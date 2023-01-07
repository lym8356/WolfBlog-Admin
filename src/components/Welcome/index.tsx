import { useEffect, useState } from "react"
import moment from "moment";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { User } from "../../models/user";

interface Props {
    user: User | null
}

export const Welcome: React.FC<Props> = ({ user }) => {
    const [timeText, setTimeText] = useState('');
    const [date, setDate] = useState('');
    const [name, setName] = useState('Guest');
    const [thumbnail, setThumbnail] = useState('./assets/user.png');
    useEffect(() => {
        if (user?.roles?.includes("Admin")) {
            setName(user.displayName);
            setThumbnail('./assets/user.png')
        }
    }, [])
    useEffect(() => {
        const hour = moment().hours();
        const dateString = moment().format('dddd').toString() + ', ' +
            moment().format("DD/MM/YYYY").toString();
        const time =
            hour < 12 ? 'Good Morning'
                : hour < 18 ? 'Good Afternoon'
                    : 'Good Evening';
        setTimeText(time);
        setDate(dateString);
    }, [])
    return (
        <Card
            sx={{ 
                display: 'flex',
                height: '15vh',
                ':hover': {
                    boxShadow: 10
                }
            }}
            elevation={4}
        >
            <CardMedia
                component='img'
                image={thumbnail}
                sx={{
                    width: 150,
                    height: 140
                }}
            >
            </CardMedia>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <CardContent>
                    <Typography variant="h5">
                        {timeText},
                    </Typography>
                    <Typography variant="h6" color="#1890FF">
                        {name}
                    </Typography>
                    <Typography variant="h5" >
                        {date}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )
}