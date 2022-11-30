import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Category, CategoryFormValues } from "../../models/category";
import agent from "../../utils/agent";

interface CategoryState {
    categories: Category[] | null;
    error: string | null;
    loading: boolean;
}

const initialState: CategoryState = {
    categories: null,
    error: null,
    loading: true
}

export const fetchCategoriesAsync = createAsyncThunk(
    'category/fetchCategoriesAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Categories.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const createCategoryAsync = createAsyncThunk(
    'category/createCategoryAsync',
    async (category: CategoryFormValues, thunkAPI) => {
        try {
            return await agent.Categories.create(category);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const editCategoryAsync = createAsyncThunk(
    'category/editCategoryAsync',
    async (category: CategoryFormValues, thunkAPI) => {
        try {
            await agent.Categories.update(category);
            return category;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const deleteCategoryAsync = createAsyncThunk(
    'category/deleteCategoryAsync',
    async (id: number, thunkAPI) => {
        try {
            await agent.Categories.delete(id);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(createCategoryAsync.fulfilled, (state, action) => {
            state.categories?.push(action.payload);
            state.loading = false;
            state.error = null;
            toast.success("Category has been added");
        });
        builder.addCase(editCategoryAsync.fulfilled, (state, action) => {
            const categoryToChange = state.categories?.find(c => c.id === action.payload.id);
            categoryToChange!.title = action.payload.title;
            state.loading = false;
            toast.success("Category has been updated");
        });
        builder.addCase(deleteCategoryAsync.fulfilled, (state, action) => {
            const categoryToDelete = state.categories?.find(c => c.id === action.payload);
            state.categories = state.categories!.filter(item => item != categoryToDelete);
            state.loading = false;
            toast.success("Category has been removed");
        });
        builder.addMatcher(isAnyOf(
            fetchCategoriesAsync.pending,
            createCategoryAsync.pending,
            editCategoryAsync.pending,
            deleteCategoryAsync.pending,
        ),
            (state, action) => {
                state.loading = true;
            });
        builder.addMatcher(isAnyOf(
            fetchCategoriesAsync.rejected,
            createCategoryAsync.rejected,
            editCategoryAsync.rejected,
            deleteCategoryAsync.rejected
        ),
            (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
                console.log(action.payload);
            });
    }
})