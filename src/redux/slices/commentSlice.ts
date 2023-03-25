import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Comment } from "../../models/comment";
import agent from "../../utils/agent";
import { RootState } from "../store";


interface CommentState {
    error: string | null;
    loading: boolean;
}

const initialState: CommentState = {
    error: null,
    loading: true
}

const commentAdapter = createEntityAdapter<Comment>();

export const fetchCommentsAsync = createAsyncThunk(
    'comment/fetchCommentsAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Comments.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const commentSlice = createSlice({
    name: 'comment',
    initialState: commentAdapter.getInitialState<CommentState>({
        loading: true,
        error: null
    }),
    reducers: {
        setComment: (state, action) => {
            commentAdapter.upsertOne(state, action.payload);
            state.loading = false;
        },
        removeComment: (state, action) => {
            commentAdapter.removeOne(state, action.payload);
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCommentsAsync.fulfilled, (state, action) => {
            const comments = action.payload;
            comments.forEach((comment) => {
                comment.replyToArticleId 
                    ? comment.parentCommentId 
                        ? comment.type = 'Article Comment [Reply]'
                        : comment.type = 'Article Comment'
                    : comment.parentCommentId
                    ? comment.type = 'Comment Board [Reply]'
                    : comment.type = 'Comment Board'
            })
            commentAdapter.setAll(state, comments);
            state.loading = false;
            state.error = null;
        });
        builder.addMatcher(isAnyOf(
            fetchCommentsAsync.pending,
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchCommentsAsync.rejected,
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });

    }
})

export const commentSelectors = commentAdapter.getSelectors((state: RootState) => state.comment);
export const { setComment, removeComment } = commentSlice.actions;