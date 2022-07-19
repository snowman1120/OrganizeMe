import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import counterReducer from '../slices/counter/counterSlice'
import chatReducer from '../slices/chat/chatSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        chat :  chatReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck : false
    })
})


export type AppDispatch = typeof store.dispatch
export type Rootstate = ReturnType<typeof store.getState>;