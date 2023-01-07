import { Grid } from "@mui/material";
import { Footer } from "../../components/Footer";
import Header from "../../components/Header"
import { Sidebar } from "../../components/Sidebar";

interface Props {
    children?: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }: Props) => {
    return (
        <Grid container>
            <Header />
            <Sidebar />
            <Grid container item
                marginTop={1}
                marginRight={1}
                marginBottom="6vh"
                marginLeft="14vw"
            >
                {children}
            </Grid>
            <Footer />
        </Grid>
    )
}