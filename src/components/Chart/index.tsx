import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Article } from '../../models/article';
import { Category } from '../../models/category';
import { generateRandomColors } from '../../utils/utils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    articles: Article[];
    categories: Category[];
}


export const Chart: React.FC<Props> = ({ articles, categories }) => {

    const countArticlesByCategory = () => {
        // create an object to store the count of articles in each cateogry
        const categoryCounts: { [key: string]: number } = {};

        // Initialize the count of each category to 0
        categories.forEach(category => {
            categoryCounts[category.id] = 0;
        })

        // Iterate through the articles and increment the count
        articles.forEach(article => {
            if (categoryCounts.hasOwnProperty(article.category.id)) {
                categoryCounts[article.category.id]++;
            }
        });
        return Object.values(categoryCounts);
    }

    const data = {
        datasets: [
            {
                data: countArticlesByCategory(),
                backgroundColor: generateRandomColors(categories.length),
                borderWidth: 8,
                borderColor: '#FFFFFF',
                hoverBorderColor: '#FFFFFF'
            }
        ],
        labels: categories.map(category => category.title)
    };

    return (
        <Card
            sx={{
                ':hover': {
                    boxShadow: 10
                },
                height: '460px'
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
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    font: { size: 14 }
                                }
                            },
                            tooltip: {
                                displayColors: false,
                                callbacks: {
                                    label: function (context) {
                                        const label = context.label || "";
                                        const value = context.parsed;
                                        return `${label}: ${value}`;
                                    }
                                }
                            }
                        },
                        hover: {
                            mode: "nearest"
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
}