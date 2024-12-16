import { useDispatch, useSelector, useStore, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch, RootState } from './store';


// Sử dụng `useDispatch` và `useSelector` từ thư viện Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();
