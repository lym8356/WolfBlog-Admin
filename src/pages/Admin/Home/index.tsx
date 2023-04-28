import { Grid } from "@mui/material"
import { Welcome } from "../../../components/Welcome"
import { AccountInfo } from "../../../components/AccountInfo"
import { useSelector } from "../../../redux/hooks"
import { CustomCard } from "../../../components/CustomCard"
import { CategoryBox } from "../../../components/CategoryBox"
import { Chart } from "../../../components/Chart"
import { TagBox } from "../../../components/TagBox"
import { articleSelectors } from "../../../redux/slices/articleSlice"
import { commentSelectors } from "../../../redux/slices/commentSlice"
import { albumSelectors } from "../../../redux/slices/albumSlice"
import { projectSelectors } from "../../../redux/slices/projectSlice"

export const Home: React.FC = () => {
    const { user } = useSelector(state => state.account);
    const { categories } = useSelector(state => state.category);
    const { tags } = useSelector(state => state.tag);
    // const { articles } = useSelector(state => state.article);
    const articles = useSelector(articleSelectors.selectAll);
    const drafts = articles?.filter(article => article.isDraft === true);
    const comments = useSelector(commentSelectors.selectAll);
    const albums = useSelector(albumSelectors.selectAll);
    const projects = useSelector(projectSelectors.selectAll);

    return (
        <>
            <Grid container item
                // marginTop={1}
                marginRight={.5}
                spacing={2}
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
                marginRight={.5}
                columns={15}
            >
                <Grid item xs={3}>
                    <CustomCard title='Articles' count={articles ? articles.length : 0} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Drafts' count={drafts ? drafts.length : 0} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Comments' count={comments ? comments.length : 0} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Albums' count={albums ? albums.length : 0} />
                </Grid>
                <Grid item xs={3}>  
                    <CustomCard title='Projects' count={projects ? projects.length : 0} />
                </Grid>
            </Grid>
            <Grid container item
                spacing={2}
                marginTop={1}
                marginRight={.5}
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
        </>
    )
}