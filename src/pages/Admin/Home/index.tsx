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
    return (
        <MainLayout>
            <Grid container item
                spacing={2}
                marginTop={1}
                marginRight={1}
                sx={{
                    marginLeft: '250px'
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
                    marginLeft: '250px'
                }}
                columns={15}
            >
                <Grid item xs={3}>
                    <CustomCard title='Articles' count={4} />
                </Grid>
                <Grid item xs={3}>
                    <CustomCard title='Drafts' count={5} />
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
                    marginLeft: '250px'
                }}
                columns={16}
            >
                <Grid item xs={8}>
                    <Chart />
                </Grid>
                <Grid item xs={4}>
                    <CategoryBox />
                </Grid>
                <Grid item xs={4}>
                    <TagBox />
                </Grid>
            </Grid>

        </MainLayout>
    )
}