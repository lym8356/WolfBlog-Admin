import { Card, CardContent, Typography } from "@mui/material";

interface Props {
    title: string;
    count: number;
}

export const CustomCard: React.FC<Props> = ({ title, count }) => {
    return (
        <Card
            elevation={2}
            sx={{
                ':hover': {
                    boxShadow: 10
                }
            }}
        >
            <CardContent>
                <Typography variant="h4">
                    {title}
                </Typography>
                <Typography align='right' variant="h3" color="secondary">
                    {count}
                </Typography>
            </CardContent>
        </Card>
    )
}