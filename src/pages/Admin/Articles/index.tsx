import { Box, Button, Checkbox, Chip, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, TextField, TextFieldProps, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import moment from "moment";
import { useSelector } from "../../../redux/hooks";
import { MainLayout } from "../../Layout/MainLayout";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Tag } from "../../../models/tag";
import { useRef, useState } from "react";
import { RestartAlt } from "@mui/icons-material";
import { Article } from "../../../models/Article";

const checkIfContained = (tagArray: Array<Tag>, searchTagArray: Array<string>) => {
    for (let i = 0; i < tagArray.length; i++) {
        for (let j = 0; j < tagArray.length; j++) {
            if (tagArray[i].title.includes(searchTagArray[j])) return true;
        }
    }
    return false;
}

const Articles: React.FC = () => {

    const { articles } = useSelector(state => state.article);
    const { tags } = useSelector(state => state.tag);
    const { categories } = useSelector(state => state.category);


    // search/navigation related
    const [articlesToShow, setArticlesToShow] = useState<Article[] | null | undefined>(articles);
    const searchKeyword = useRef<TextFieldProps>(null);
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [searchTag, setSearchTag] = useState<string[]>([]);
    // setting up page size 
    const [pageSize, setPageSize] = useState(10);

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

    const buttonGroups = () => {
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
                >
                    Edit
                </Button>
                <Button
                    sx={{
                        color: 'secondary.main',
                        backgroundColor: 'primary.main',
                        ':hover': {
                            color: 'primary.main',
                            backgroundColor: 'secondary.light',
                        }
                    }}
                >
                    Delete
                </Button>
            </Box>
        )
    }


    const columns: GridColDef[] = [
        {
            field: 'title', headerName: 'Title', flex: 1, minWidth: 300,
            headerAlign: 'center', align: 'center',
        },
        {
            field: 'date', headerName: 'Published Date', flex: 1,
            minWidth: 300, headerAlign: 'center', align: 'center',
            valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY hh:mm A")
        },
        {
            field: 'category', headerName: 'Category', sortable: false,
            flex: 1, minWidth: 300, headerAlign: 'center', align: 'center',
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
            renderCell: buttonGroups
        }
    ];

    // handle data to show
    const data = articlesToShow ? articlesToShow.map(article => ({
        id: article.id,
        title: article.title,
        date: article.createdAt,
        category: article.category.title,
        tags: article.articleTags
    })) : [];

    return (
        <MainLayout>
            <Grid container item
                marginTop={1}
                marginRight={1}
                sx={{
                    marginLeft: '13.5vw',
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
                                backgroundColor: 'secondary.main',
                                color: 'primary.main'
                            }
                        }}
                    >
                        <RestartAlt fontSize="large"
                        />
                    </IconButton>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        size="large"
                        sx={{
                            width: '80%',
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
                </Grid>
            </Grid>
            <Grid container item
                marginTop={1}
                marginRight={1}
                sx={{
                    marginLeft: '13.5vw'
                }}
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
        </MainLayout>
    )
}

export default Articles;