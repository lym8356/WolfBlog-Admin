import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { SiteLog } from "../../models/siteLog";
import agent from "../../utils/agent";
import { RootState } from "../store";


interface SiteLogState {
    error: string | null;
    loading: boolean;
}

const initialState: SiteLogState = {
    error: null,
    loading: true
}

const siteLogAdapter = createEntityAdapter<SiteLog>();

export const fetchSiteLogsAsync = createAsyncThunk(
    'siteLog/fetchSiteLogsAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.SiteLogs.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const siteLogSlice = createSlice({
    name: 'siteLog',
    initialState: siteLogAdapter.getInitialState<SiteLogState>({
        loading: true,
        error: null
    }),
    reducers: {
        setSiteLog: (state, action) => {
            siteLogAdapter.upsertOne(state, action.payload);
            state.loading = false;
        },
        removeSiteLog: (state, action) => {
            siteLogAdapter.removeOne(state, action.payload);
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSiteLogsAsync.fulfilled, (state, action) => {
            siteLogAdapter.setAll(state, action.payload);
            state.loading = false;
            state.error = null;
        });
        builder.addMatcher(isAnyOf(
            fetchSiteLogsAsync.pending,
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchSiteLogsAsync.rejected,
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });

    }
})

export const siteLogSelectors = siteLogAdapter.getSelectors((state: RootState) => state.siteLog);
export const { setSiteLog, removeSiteLog } = siteLogSlice.actions;