import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Project } from "../../models/project";
import agent from "../../utils/agent";
import { RootState } from "../store";

interface ProjectState {
    error: string | null;
    loading: boolean;
}

const initialState: ProjectState = {
    error: null,
    loading: true
}

const projectAdapter = createEntityAdapter<Project>();

export const fetchProjectsAsync = createAsyncThunk(
    'project/fetchProjectsAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Projects.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const projectSlice = createSlice({
    name: 'album',
    initialState: projectAdapter.getInitialState<ProjectState>({
        loading: true,
        error: null
    }),
    reducers: {
        setProject: (state, action) => {
            projectAdapter.upsertOne(state, action.payload);
            state.loading = false;
        },
        removeProject: (state, action) => {
            projectAdapter.removeOne(state, action.payload);
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjectsAsync.fulfilled, (state, action) => {
            projectAdapter.setAll(state, action.payload);
            state.loading = false;
            state.error = null;
        });
        builder.addMatcher(isAnyOf(
            fetchProjectsAsync.pending,
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchProjectsAsync.rejected,
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });

    }
})

export const projectSelectors = projectAdapter.getSelectors((state: RootState) => state.project);
export const { setProject, removeProject } = projectSlice.actions;