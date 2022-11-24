import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
    useDispatch
} from 'react-redux';
import { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
