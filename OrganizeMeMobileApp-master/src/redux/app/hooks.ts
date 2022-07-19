import { TypedUseSelectorHook , useDispatch , useSelector } from 'react-redux'
import { Rootstate, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector : TypedUseSelectorHook<Rootstate> = useSelector;