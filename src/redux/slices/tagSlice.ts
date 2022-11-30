import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Tag, TagFormValues } from "../../models/tag"
import agent from "../../utils/agent";

interface TagState {
    tags: Tag[] | null;
    error: string | null;
    loading: boolean;
}

const initialState: TagState = {
    tags: null,
    error: null,
    loading: true
}

export const fetchTagsAsync = createAsyncThunk(
    'tag/fetchTagsAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Tags.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const createTagAsync = createAsyncThunk(
    'tag/createTagAsync',
    async (tag: TagFormValues, thunkAPI) => {
        try {
            return await agent.Tags.create(tag);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const editTagAsync = createAsyncThunk(
    'tag/editTagAsync',
    async (tag: TagFormValues, thunkAPI) => {
        try {
            await agent.Tags.update(tag);
            return tag;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const deleteTagAsync = createAsyncThunk(
    'tag/deleteTagAsync',
    async (id: number, thunkAPI) => {
        try {
            await agent.Tags.delete(id);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTagsAsync.fulfilled, (state, action) => {
            state.tags = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(createTagAsync.fulfilled, (state, action) => {
            state.tags?.push(action.payload);
            state.loading = false;
            state.error = null;
            toast.success("Tag has been added");
        });
        builder.addCase(editTagAsync.fulfilled, (state, action) => {
            const tagToChange = state.tags?.find(t => t.id === action.payload.id);
            tagToChange!.title = action.payload.title;
            state.loading = false;
            toast.success("Tag has been updated");
        });
        builder.addCase(deleteTagAsync.fulfilled, (state, action) => {
            const tagToDelete = state.tags?.find(t => t.id === action.payload);
            state.tags = state.tags!.filter(item => item != tagToDelete);
            state.loading = false;
            toast.success("Tag has been removed");
        });
        builder.addMatcher(isAnyOf(
            fetchTagsAsync.pending,
            createTagAsync.pending,
            editTagAsync.pending,
            deleteTagAsync.pending
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchTagsAsync.rejected,
            createTagAsync.rejected,
            editTagAsync.rejected,
            deleteTagAsync.rejected
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });
    }
})