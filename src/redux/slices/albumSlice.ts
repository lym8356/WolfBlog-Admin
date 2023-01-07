import { createAsyncThunk, createEntityAdapter, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Album } from "../../models/album";
import agent from "../../utils/agent";
import { RootState } from "../store";


interface AlbumState {
    // albums: Album[] | null;
    error: string | null;
    loading: boolean;
}

const albumAdapter = createEntityAdapter<Album>();

export const fetchAlbumsAsync = createAsyncThunk(
    'album/fetchAlbumsAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Albums.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const uploadImageAsync = createAsyncThunk(
    'album/uploadImageAsync',
    async ({ file, albumId }: { file: Blob, albumId: number }, thunkAPI) => {
        try {
            const newImage = await agent.Albums.upload(file, albumId);
            const response = {
                image: newImage.data,
                albumId: albumId
            }
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const setCoverAsync = createAsyncThunk(
    'album/setCoverAsync',
    async ({ albumId, imageId }: { albumId: number, imageId: string }, thunkAPI) => {
        try {
            return await agent.Albums.setCover(albumId, imageId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const deleteImageAsync = createAsyncThunk(
    'album/deleteImageAsync',
    async ({ albumId, imageId }: { albumId: number, imageId: string }, thunkAPI) => {
        try {
            return await agent.Albums.deleteImage(albumId, imageId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const albumSlice = createSlice({
    name: 'album',
    initialState: albumAdapter.getInitialState<AlbumState>({
        loading: true,
        error: null
    }),
    reducers: {
        setAlbum: (state, action) => {
            albumAdapter.upsertOne(state, action.payload);
            state.loading = false;
        },
        removeAlbum: (state, action) => {
            albumAdapter.removeOne(state, action.payload);
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAlbumsAsync.fulfilled, (state, action) => {
            albumAdapter.setAll(state, action.payload);
            state.loading = false;
            state.error = null;
        });
        builder.addCase(uploadImageAsync.fulfilled, (state, action) => {
            const { image, albumId } = action.payload;
            const albumToPush = state.entities[albumId];
            if (albumToPush?.albumPhotos.length === 0) albumToPush.cover = image.url;
            albumToPush?.albumPhotos.push(image);
            state.loading = false;
            state.error = null;
        });
        builder.addCase(setCoverAsync.fulfilled, (state, action) => {
            const newAlbum = action.payload;
            state.entities[newAlbum.id] = newAlbum;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(deleteImageAsync.fulfilled, (state, action) => {
            const newAlbum = action.payload;
            state.entities[newAlbum.id] = newAlbum;
            state.loading = false;
            state.error = null;
        });
        builder.addMatcher(isAnyOf(
            fetchAlbumsAsync.pending,
            uploadImageAsync.pending,
            setCoverAsync.pending,
            deleteImageAsync.pending
        ), (state, action) => {
            state.loading = true;
        });
        builder.addMatcher(isAnyOf(
            fetchAlbumsAsync.rejected,
            uploadImageAsync.rejected,
            setCoverAsync.rejected,
            deleteImageAsync.rejected
        ), (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
            console.log(action.payload);
        });

    }
})

export const albumSelectors = albumAdapter.getSelectors((state: RootState) => state.album);
export const { setAlbum, removeAlbum } = albumSlice.actions;