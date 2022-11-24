import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./slices/accountSlice";


const rootReducer = combineReducers({
    account: accountSlice.reducer
});


const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
