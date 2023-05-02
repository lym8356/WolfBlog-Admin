import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Article } from "../../models/article";
import agent from "../../utils/agent";
import { RootState } from "../store";


interface ArticleState {
    // articles: Article[] | null;
    error: string | null;
    loading: boolean;
}

const articlesAdapter = createEntityAdapter<Article>();

export const fetchArticlesAsync = createAsyncThunk(
    'article/fetchArticlesAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Articles.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchArticleAsync = createAsyncThunk(
    'article/fetchArticleAsync',
    async (articleId:string, thunkAPI) => {
        try {
            return await agent.Articles.details(articleId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const articleSlice = createSlice({
    name: 'article',
    initialState: articlesAdapter.getInitialState<ArticleState>({
        loading: true,
        error: null
    }),
    reducers: {
        setArticle: (state, action) => {
            articlesAdapter.upsertOne(state, action.payload);
            state.loading = false;
        },
        removeArticle: (state, action) => {
            articlesAdapter.removeOne(state, action.payload);
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchArticlesAsync.fulfilled, (state, action) => {
            // state.articles = action.payload;
            articlesAdapter.setAll(state, action.payload);
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchArticleAsync.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            articlesAdapter.upsertOne(state, action.payload);
        })
        builder.addMatcher(isAnyOf(
            fetchArticlesAsync.pending,
            fetchArticleAsync.pending
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchArticlesAsync.rejected,
            fetchArticleAsync.rejected
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });
    }
});

export const articleSelectors = articlesAdapter.getSelectors((state: RootState) => state.article);
export const { setArticle, removeArticle } = articleSlice.actions;

export const selectAllArticles = createSelector(
    [articleSelectors.selectAll],
    (articles) => articles.filter((article) => !article.isDraft)
);

export const selectAllDrafts = createSelector(
    [articleSelectors.selectAll],
    (articles) => articles.filter((article) => article.isDraft)
);

