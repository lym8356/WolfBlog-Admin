import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useSelector } from "../../../../redux/hooks";
import { aboutPageSelectors, setAboutPage } from "../../../../redux/slices/aboutPageSlice";
import { AboutPage } from "../../../../models/aboutPage";
import { Button, Grid, Typography } from "@mui/material";
import CustomTextfield from "../../../../components/FormsUI/CustomTextfield";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import agent from "../../../../utils/agent";


export const AboutDetails: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const aboutContent = useSelector(state => aboutPageSelectors.selectById(state, id as string));
    const [aboutFormValues, setAboutFormValues] = useState<AboutPage>(aboutContent!);
    const [content, setContent] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (aboutContent) {
            setAboutFormValues(aboutContent);
            setContent(aboutContent.content);
        }
    }, [dispatch, aboutContent])

    async function handleSubmit(aboutPage: AboutPage) {
        try {
            let response: AboutPage = await agent.Abouts.update(aboutPage);
            toast.success("About Content Updated");
            dispatch(setAboutPage(response));
        } catch (error) {
            console.log(error);
            toast.error("Error peforming action");
        }
    }

    return (
        <>
            <Formik
                initialValues={aboutFormValues}
                enableReinitialize
                onSubmit={(values) => { handleSubmit(values) }}
            >
                {({ handleSubmit, setFieldValue, isSubmitting }) => (
                    <Form autoComplete="false" style={{ width: "100%" }} onSubmit={handleSubmit}>
                        <Grid container item>
                            <Grid container item
                                sx={{
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: "primary.main"
                                }}
                            >
                                <Button
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        marginLeft: '5px',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.main',
                                            color: 'primary.main'
                                        }
                                    }}
                                    onClick={() => navigate('/admin/about/')}
                                >
                                    Back
                                </Button>
                                <Typography variant="h4" color="secondary.main">
                                    About {aboutContent?.isAboutSite ? 'Site' : 'Me'}
                                </Typography>
                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.main',
                                            color: 'primary.main'
                                        },
                                        marginRight: '1px',
                                        '& .MuiCircularProgress-root': {
                                            // backgroundColor: 'yellow',
                                            color: 'secondary.main'
                                        }
                                    }}
                                >
                                    Update
                                </LoadingButton>
                            </Grid>
                            <Grid item xs={6}
                                sx={{
                                    minHeight: '80vh',
                                    overflow: 'auto',
                                    backgroundColor: "#d3d3d3"
                                }}
                            >
                                <CustomTextfield
                                    fullWidth
                                    name="content"
                                    multiline
                                    variant="outlined"
                                    onChange={(e) => {
                                        setFieldValue("content", e.target.value);
                                        setContent(e.target.value);
                                    }}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        '& fieldset': { border: 'none' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}
                                sx={{
                                    minHeight: '80vh',
                                    overflow: 'auto',
                                    width: '100%',
                                    padding: '5px',
                                    backgroundColor: 'primary.light'
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    children={content}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    children={String(children).replace(/\n$/, '')}
                                                    style={darcula}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                />
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </>
    )
}