import { Grid } from "@mui/material"
import { MainLayout } from "../../Layout/MainLayout"
import { Welcome } from "../../../components/Welcome"
import { AccountInfo } from "../../../components/AccountInfo"
import { useSelector } from "../../../redux/hooks"
import { CustomCard } from "../../../components/CustomCard"
import { CategoryBox } from "../../../components/CategoryBox"
import { Chart } from "../../../components/Chart"
import { TagBox } from "../../../components/TagBox"

export const Home: React.FC = () => {
    const { user } = useSelector(state => state.account);
    const { categories } = useSelector(state => state.category);
    const { tags } = useSelector(state => state.tag);
    const { articles } = useSelector(state => state.article);
    const drafts = articles?.filter(article => article.isDraft === true);

    return (
        <MainLayout>
            <Grid container item
                spacing={2}
                marginTop={1}
                marginRight={1}
                sx={{
                    marginLeft: '13vw'
                }}
            >
                <Grid item xs={6}>
                    <Welcome user={user} />
                </Grid>
                <Grid item xs={6}>
                    <AccountInfo user={user} />
                </Grid>
            </Grid>
            <Grid container item
                spacing={2}
                marginTop={1}
                marginRight={1}
                sx={{
                    marginLeft: '13vw'
                }}
                columns={15}
            >
                <Grid item xs={3}>
                    <CustomCard title='Articles' count={articles ? articles.length : 0} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Drafts' count={drafts ? drafts.length : 0} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Comments' count={15} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Albums' count={5} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Projects' count={3} />
                </Grid>
            </Grid>
            <Grid container item
                spacing={2}
                marginTop={1}
                marginRight={1}
                sx={{
                    marginLeft: '13vw'
                }}
                columns={16}
            >
                <Grid item xs={8}>
                    <Chart />
                </Grid>
                <Grid item xs={4}>
                    <CategoryBox categories={categories} />
                </Grid>
                <Grid item xs={4}>
                    <TagBox tags={tags} />
                </Grid>
            </Grid>
        </MainLayout>
    )
}