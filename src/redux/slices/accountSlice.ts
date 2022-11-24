import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../../models/user";
import agent from "../../utils/agent";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null,
}

// const navigate = useNavigate();

export const login = createAsyncThunk(
    'account/login',
    async (data: {
        username: string,
        password: string
    }, thunkAPI) => {
        try {
            const user = await agent.Account.login(data);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)


export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async(_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUser: (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles]:roles};
        },
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            // navigate("/");
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error("Session expired - please login again.");
            // navigate("/");
        });
        builder.addMatcher(isAnyOf(login.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};
        });
        builder.addMatcher(isAnyOf(login.rejected), (state, action) => {
            throw action.payload;
        })
    })
})


export const {logOut,setUser} = accountSlice.actions;