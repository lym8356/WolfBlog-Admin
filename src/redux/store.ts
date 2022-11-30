import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./slices/accountSlice";
import { articleSlice } from "./slices/articleSlice";
import { categorySlice } from "./slices/categorySlice";
import { tagSlice } from "./slices/tagSlice";


const rootReducer = combineReducers({
    account: accountSlice.reducer,
    category: categorySlice.reducer,
    tag: tagSlice.reducer,
    article: articleSlice.reducer
});


const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
