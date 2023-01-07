import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    datasets: [
        {
            data: [63, 15, 22],
            backgroundColor: ['#3F51B5', '#e53935', '#FB8C00'],
            borderWidth: 8,
            borderColor: '#FFFFFF',
            hoverBorderColor: '#FFFFFF'
        }
    ],
    labels: ['Leetcode', 'C#', 'Java']
};

export const Chart: React.FC = () => {
    return (
        <Card
            sx={{
                ':hover': {
                    boxShadow: 10
                },
                height: '51vh'
            }}
            elevation={4}
        >
            <CardHeader title="Article Category Overview" />
            <CardContent
                sx={{
                    maxHeight: '40vh',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: '1.3vh'
                }}
            >
                <Pie data={data}
                    options={{
                        plugins:{legend:{labels:{font:{size:16}}}}
                    }}
                />
            </CardContent>
        </Card>
    )
}