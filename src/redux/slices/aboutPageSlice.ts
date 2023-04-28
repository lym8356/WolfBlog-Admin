import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AboutPage } from "../../models/aboutPage";
import agent from "../../utils/agent";
import { RootState } from "../store";


interface AboutPageState {
    error: string | null;
    loading: boolean;
}

const initialState: AboutPageState = {
    error: null,
    loading: true
}

const aboutPageAdapter = createEntityAdapter<AboutPage>();

export const fetchAboutPageAsync = createAsyncThunk(
    'aboutPage/fetchAboutPageAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Abouts.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const aboutPageSlice = createSlice({
    name: 'aboutPage',
    initialState: aboutPageAdapter.getInitialState<AboutPageState>({
        loading: true,
        error: null
    }),
    reducers: {
        setAboutPage: (state, action) => {
            aboutPageAdapter.upsertOne(state, action.payload);
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAboutPageAsync.fulfilled, (state, action) => {
            aboutPageAdapter.setAll(state, action.payload);
            state.loading = false;
            state.error = null;
        });
        builder.addMatcher(isAnyOf(
            fetchAboutPageAsync.pending,
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchAboutPageAsync.rejected,
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });

    }
})

export const aboutPageSelectors = aboutPageAdapter.getSelectors((state: RootState) => state.aboutPage);
export const { setAboutPage } = aboutPageSlice.actions;