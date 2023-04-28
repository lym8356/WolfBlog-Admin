import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useSelector } from "../../../../redux/hooks";
import { articleSelectors, setArticle } from "../../../../redux/slices/articleSlice";
import { Grid, InputLabel, TextField, Typography } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import CustomTextfield from "../../../../components/FormsUI/CustomTextfield";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import moment from "moment";
import { Article, ArticleFormValues } from "../../../../models/article";
import CustomSelectInput from "../../../../components/FormsUI/CustomSelectInput";
import { LoadingButton } from "@mui/lab";
import agent from "../../../../utils/agent";
import { toast } from "react-toastify";
import { NotFound } from "../../../../components/NotFound";

export const ArticleDetails: React.FC = () => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const article = useSelector(state => articleSelectors.selectById(state, id as string));
    const { categories } = useSelector(state => state.category);
    const { tags } = useSelector(state => state.tag);
    const [articleFormValues, setArticleFormValues] = useState<ArticleFormValues>(new ArticleFormValues());
    // to display article content
    const [content, setContent] = useState('');
    // use local state for different form submit
    const [isSave, setIsSave] = useState(false);
    // check if the article is a draft
    const [isDraft, setIsDraft] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // if there is an article, fill up the form with the article content
        if (article) {
            setContent(article.content);
            setIsDraft(article.isDraft);
            setArticleFormValues(new ArticleFormValues(article));
        }
        
    }, [dispatch, article, id])

    const validationSchema = Yup.object({
        title: Yup.string().required('The article title is required.'),
        categoryId: Yup.string().required('The article must have a category').nullable(),
        tagIds: Yup.array().min(1, 'The article must have at least 1 tag'),
        content: Yup.string().required('The article content must not be empty')
    })

    async function handleDraftSubmit(articleFormValues: ArticleFormValues) {
        try {
            let response: Article;
            if (isSave) {
                articleFormValues.isDraft = true;
                response = await agent.Articles.update(articleFormValues);
                toast.success("Article saved to draft");
            } else {
                articleFormValues.isDraft = false;
                response = await agent.Articles.update(articleFormValues);
                toast.success("Article published");
            }
            dispatch(setArticle(response));
        } catch (error) {
            console.log(error);
            toast.error("Error performing action");
        }
    }

    async function handleArticleSubmit(articleFormValues: ArticleFormValues) {
        try {
            let response: Article;
            if (isSave) {
                if (article) {
                    articleFormValues.isDraft = true;
                    response = await agent.Articles.update(articleFormValues);
                    toast.success("Article saved to draft");
                } else {
                    articleFormValues.isDraft = true;
                    response = await agent.Articles.create(articleFormValues);
                    toast.success("Article saved to draft");
                }
            } else {
                if (article) {
                    response = await agent.Articles.update(articleFormValues);
                    toast.success("Article updated");
                } else {
                    response = await agent.Articles.create(articleFormValues);
                    toast.success("Article created");
                    navigate(`/admin/articles/${response.id}`);
                }
            }
            dispatch(setArticle(response));

        } catch (error) {
            console.log(error);
            toast.error("Error performing action");
        }
    }
    if (id && !article) return <NotFound />

    return (
        <>
            <Formik
                initialValues={articleFormValues}
                enableReinitialize
                validationSchema={validationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={isDraft ? (values) => { handleDraftSubmit(values) }
                    : (values) => { handleArticleSubmit(values) }}
            >
                {({ handleSubmit, setFieldValue, isSubmitting }) => (
                    <Form autoComplete="false" style={{ width: "100%" }} onSubmit={handleSubmit}>
                        <Grid container item
                            sx={{
                                marginTop: '1vh',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Grid item xs={2}>
                                <CustomTextfield
                                    name="title"
                                    label="Title"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    label="Last Update"
                                    defaultValue={moment(article?.updatedAt).format("DD/MM/YYYY hh:mm A")}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CustomSelectInput
                                    name="categoryId"
                                    label="Category"
                                    options={categories}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <CustomSelectInput
                                    name="tagIds"
                                    options={tags}
                                    label="Tag(s)"
                                    multiple
                                />
                            </Grid>
                            <Grid item xs={2}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}
                            >
                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={() => setIsSave(false)}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}

                                >
                                    {article && article.isDraft ? "Publish" :
                                        article && !article.isDraft ? "Update" :
                                            "Publish"
                                    }
                                </LoadingButton>
                                <LoadingButton
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                    onClick={() => setIsSave(true)}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'secondary.main',
                                        ':hover': {
                                            backgroundColor: 'secondary.light',
                                            color: 'primary.main'
                                        }
                                    }}
                                >
                                    Save
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        <Grid container item marginTop={3}>
                            <Grid item xs={6}
                                sx={{
                                    height: '75vh',
                                    overflow: 'auto'
                                }}
                            >
                                <InputLabel><Typography variant="h5">Content</Typography></InputLabel>
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
                                        backgroundColor: 'secondary.light',
                                        '& fieldset': { border: 'none' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}
                                sx={{
                                    height: '75vh',
                                    overflow: 'auto',
                                    width: '100%'
                                }}
                            >
                                <InputLabel><Typography variant="h5">Preview</Typography></InputLabel>
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