import { Box, Button, Checkbox, Chip, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, TextField, TextFieldProps, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import moment from "moment";
import { useAppDispatch, useSelector } from "../../../redux/hooks";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Tag } from "../../../models/tag";
import { useEffect, useRef, useState } from "react";
import { RestartAlt } from "@mui/icons-material";
import { Article } from "../../../models/article";
import { useNavigate } from "react-router-dom";
import { articleSelectors, removeArticle } from "../../../redux/slices/articleSlice";
import { CustomDeleteDialog } from "../../../components/CustomDeleteDialog";
import agent from "../../../utils/agent";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";

// check if tagArray contains everything in searchTagArray
const checkIfContained = (tagArray: Array<Tag>, searchTagArray: Array<string>) => {
    // create a temp array to store only the tag title 
    const tempArr: string[] = [];
    // 2n, need a better solution
    for (let i = 0; i < tagArray.length; i++) {
        tempArr.push(tagArray[i].title);
    }
    for (let i = 0; i < searchTagArray.length; i++) {
        if (!tempArr.includes(searchTagArray[i])) return false;
    }
    return true;
}

const Articles: React.FC = () => {

    let articles = useSelector(articleSelectors.selectAll);
    // filter drafts, use custom selector ?
    // articles = articles.filter(a => a.isDraft == false);
    const { tags } = useSelector(state => state.tag);
    const { categories } = useSelector(state => state.category);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // search/navigation related
    const [articlesToShow, setArticlesToShow] = useState<Article[] | null | undefined>(articles);
    const searchKeyword = useRef<TextFieldProps>(null);
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [searchTag, setSearchTag] = useState<string[]>([]);
    // setting up page size 
    const [pageSize, setPageSize] = useState(10);

    // pass in props to control popup dialog
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '',
        onConfirm: function () { }
    });
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);

    const searchByKeyword = () => {
        setSearchCategory("");
        setSearchTag([]);
        const keyword = searchKeyword.current?.value as string;

        if (!keyword) {
            setArticlesToShow(articles);
            return;
        }
        const newArticlesToShow = articles?.filter(
            item => item.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        );
        setArticlesToShow(newArticlesToShow);
    }

    const searchByCategory = (event: SelectChangeEvent<typeof searchCategory>) => {
        searchKeyword.current!.value = '';
        setSearchTag([]);
        const { target: { value } } = event;
        if (!value) {
            setArticlesToShow(articles);
            return;
        }
        const newArticlesToShow = articles?.filter(item => item.category.title === value);
        setSearchCategory(value);
        setArticlesToShow(newArticlesToShow);
    }

    const searchByTag = (event: SelectChangeEvent<typeof searchTag>) => {
        searchKeyword.current!.value = '';
        setSearchCategory("");
        const { target: { value } } = event;
        setSearchTag(
            typeof value === 'string' ? value.split(',') : value
        )
        if (value.length === 0) {
            setArticlesToShow(articles);
            return;
        }
        // this logic needs to be optimized for peformance
        const articlesByTag = [];
        const articlesLength = articles?.length;
        if (articlesLength) {
            for (let i = 0; i < articlesLength; i++) {
                if (checkIfContained(articles[i].articleTags, value as string[])) {
                    articlesByTag.push(articles[i]);
                }
            }
            setArticlesToShow(articlesByTag);
        } else {
            return;
        }
    }

    const resetFilters = () => {
        searchKeyword.current!.value = '';
        setSearchCategory("");
        setSearchTag([]);
        setArticlesToShow(articles);
    }

    const onDelete = (id: string) => {
        setLoading(true);
        setTarget(id);
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        agent.Articles.delete(id)
            .then(() => {
                dispatch(removeArticle(id));
                toast.success("Article deleted");
            })
            .catch((error: any) => {
                console.log(error);
                toast.error("Error deleting article");
            }).finally(() => setLoading(false));
    }

    // rerender component after delete, better solution ??
    useEffect(() => {
        setArticlesToShow(articles);
    }, [articles]);

    const buttonGroups = (params: any) => {
        return (
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}
            >
                <Button
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: 'primary.main',
                        ':hover': {
                            color: 'primary.main',
                            backgroundColor: 'secondary.light',
                        }
                    }}
                    onClick={() => navigate(`/admin/articles/${params.id}`)}
                >
                    Edit
                </Button>
                <LoadingButton
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: 'primary.main',
                        ':hover': {
                            color: 'primary.main',
                            backgroundColor: 'secondary.light',
                        },
                        '& .MuiLoadingButton-loadingIndicator': {
                            color: 'secondary.main'
                        }
                    }}
                    loading={loading && target == params.id}
                    onClick={() => {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'article',
                            onConfirm: () => { onDelete(params.id) }
                        })
                    }}
                >
                    Delete
                </LoadingButton>
            </Box>
        )
    }


    const columns: GridColDef[] = [
        {
            field: 'title', headerName: 'Title', flex: 0.7, minWidth: 200,
            headerAlign: 'center', align: 'center',
        },
        {
            field: 'date', headerName: 'Published Date', flex: 0.7,
            minWidth: 300, headerAlign: 'center', align: 'center',
            valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: 'updatedAt', headerName: 'Last Updated', flex: 0.7,
            minWidth: 300, headerAlign: 'center', align: 'center',
            valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: 'category', headerName: 'Category', sortable: false,
            flex: 0.5, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => <Chip label={params.value} variant="outlined"
                sx={{ color: 'primary.main', fontSize: '1rem', borderColor: 'primary.main' }}
            />
        },
        {
            field: 'tags', headerName: 'Tags', sortable: false, flex: 1,
            minWidth: 300, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <>
                    {params.value.map((tag: Tag, index: number) => (
                        <Typography key={index}
                            sx={{
                                width: 'fit-content',
                                margin: ' 0 .5vw',
                                padding: '0 10px',
                                backgroundColor: 'primary.main',
                                color: 'secondary.main'
                            }}
                        >
                            {tag.title}
                        </Typography>
                    ))}
                </>
            )
        },
        {
            field: 'actions', headerName: 'Actions', sortable: false,
            flex: 0.5, minWidth: 100, headerAlign: 'center',
            renderCell: (params) => (
                buttonGroups(params)
            )
        }
    ];

    // handle data to show
    const data = articlesToShow ? articlesToShow.map(article => ({
        id: article.id,
        title: article.title,
        date: article.createdAt,
        updatedAt: article.updatedAt,
        category: article.category.title,
        tags: article.articleTags
    })) : [];

    return (
        <>
            <Grid container item
                marginTop={1}
                marginRight={1}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Grid item xs={3}>
                    <TextField fullWidth
                        inputRef={searchKeyword}
                        onChange={searchByKeyword}
                        label="Searcy by title"
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="category-search-box">Search by category</InputLabel>
                        <Select
                            labelId="category-search-box"
                            input={<OutlinedInput label="Search by category" />}
                            fullWidth
                            value={searchCategory}
                            onChange={searchByCategory}
                        >
                            <MenuItem value="">&nbsp;</MenuItem>
                            {categories?.map((category) => (
                                <MenuItem key={category.id} value={category.title} >{category.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="tag-search-box">Search by tag(s)</InputLabel>
                        <Select
                            fullWidth
                            multiple
                            input={<OutlinedInput label="Search by tag(s)" />}
                            value={searchTag}
                            onChange={searchByTag}
                            renderValue={(selected: Array<string>) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((item) => (
                                        <Chip
                                            key={item}
                                            label={item}
                                            sx={{ backgroundColor: 'primary.main', color: 'secondary.main' }}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {tags?.map((tag) => (
                                <MenuItem key={tag.id} value={tag.title}>
                                    <Checkbox checked={searchTag.indexOf(tag.title) > -1} />
                                    <ListItemText primary={tag.title} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        onClick={resetFilters}
                        sx={{
                            borderRadius: 1,
                            backgroundColor: 'primary.main',
                            color: 'secondary.main',
                            ':hover': {
                                backgroundColor: 'secondary.light',
                                color: 'primary.main'
                            }
                        }}
                    >
                        <RestartAlt fontSize="large"
                        />
                    </IconButton>
                </Grid>
                <Grid item xs={1}>
                    <Link to="/admin/articles/createArticle">
                        <Button
                            size="large"
                            sx={{
                                width: '100%',
                                color: 'secondary.main',
                                backgroundColor: 'primary.main',
                                ':hover': {
                                    color: 'primary.main',
                                    backgroundColor: 'secondary.light',
                                }
                            }}
                        >
                            NEW
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            <Grid container item
                marginTop={1}
            >
                <DataGrid
                    autoHeight
                    rows={data}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageSizeChange={(newPageSize) => { setPageSize(newPageSize) }}
                    disableColumnMenu
                    disableSelectionOnClick
                    sx={{
                        '.MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.main',
                            color: 'secondary.main',
                            fontSize: '1.2rem'
                        },
                        '.MuiDataGrid-sortIcon': {
                            color: 'secondary.main'
                        },
                        '.MuiDataGrid-row': {
                            fontSize: '1.1rem'
                        }
                    }}
                />
            </Grid>
            <CustomDeleteDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}

export default Articles;