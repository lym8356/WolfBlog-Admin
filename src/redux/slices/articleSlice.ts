import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Article } from "../../models/Article";
import agent from "../../utils/agent";


interface ArticleState {
    articles: Article[] | null;
    error: string | null;
    loading: boolean;
}

const initialState: ArticleState = {
    articles: null,
    error: null,
    loading: true
}

export const fetchArticclesAsync = createAsyncThunk(
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

export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchArticclesAsync.fulfilled, (state, action) => {
            state.articles = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addMatcher(isAnyOf(
            fetchArticclesAsync.pending,
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchArticclesAsync.rejected,
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });
    }
})