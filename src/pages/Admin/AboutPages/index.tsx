import { Edit } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { aboutPageSelectors } from "../../../redux/slices/aboutPageSlice";
import { useSelector } from "../../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { NoData } from "../../../components/NoData";

const AboutPages: React.FC = () => {

    const aboutPages = useSelector(aboutPageSelectors.selectAll);
    const navigate = useNavigate();
    const aboutMe = aboutPages.find(a => a.isAboutSite === false);
    const aboutSite = aboutPages.find(a => a.isAboutSite === true);

    return (
        <>
            {aboutPages.length > 0 ?
                <Grid container>
                    <Grid container height={50}>
                        <Grid
                            container
                            item
                            justifyContent="space-between"
                            alignItems="center"
                            xs={6}
                            sx={{
                                backgroundColor: "primary.main"
                            }}
                        >
                            <Grid item marginLeft={1}>
                                <IconButton
                                    sx={{
                                        color: "secondary.main",
                                        borderRadius: '0',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}
                                    onClick={() => navigate(`/about/${aboutMe!.id}`)}
                                >
                                    <Edit />
                                </IconButton>
                            </Grid>

                            <Grid item display="flex" justifyContent="center">
                                <Typography variant="h4" color="secondary.main">
                                    About me
                                </Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                        <Grid
                            container
                            item
                            justifyContent="space-between"
                            alignItems="center"
                            xs={6}
                            sx={{
                                backgroundColor: "#484848"
                            }}
                        >
                            <Grid item marginLeft={1}>
                                <IconButton
                                    sx={{
                                        color: "secondary.main",
                                        borderRadius: '0',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}
                                    onClick={() => navigate(`/about/${aboutSite!.id}`)}
                                >
                                    <Edit />
                                </IconButton>
                            </Grid>

                            <Grid item display="flex" justifyContent="center">
                                <Typography variant="h4" color="secondary.light">
                                    About site
                                </Typography>
                            </Grid>
                            <Grid item />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={6} padding={5}
                            sx={{
                                backgroundColor: "#d3d3d3"
                            }}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                children={aboutMe!.content}
                            />
                        </Grid>
                        <Grid item xs={6} padding={5}
                            sx={{
                                backgroundColor: "#C0C0C0"
                            }}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                children={aboutSite!.content}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                :
                <NoData />
            }
        </>
    )
}

export default AboutPages;