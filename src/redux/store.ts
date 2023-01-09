import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./slices/accountSlice";
import { albumSlice } from "./slices/albumSlice";
import { articleSlice } from "./slices/articleSlice";
import { categorySlice } from "./slices/categorySlice";
import { projectSlice } from "./slices/projectSlice";
import { tagSlice } from "./slices/tagSlice";


const rootReducer = combineReducers({
    account: accountSlice.reducer,
    category: categorySlice.reducer,
    tag: tagSlice.reducer,
    article: articleSlice.reducer,
    album: albumSlice.reducer,
    project: projectSlice.reducer
});


const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
