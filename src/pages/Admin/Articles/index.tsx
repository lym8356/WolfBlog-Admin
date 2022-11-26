import { Grid } from "@mui/material";
import { MainLayout } from "../../Layout/MainLayout";


const Articles : React.FC = () => {
    return (
        <MainLayout>
            <Grid item xs={12}>
                <h1>Articles</h1>
            </Grid>
        </MainLayout>
    )
}

export default Articles;