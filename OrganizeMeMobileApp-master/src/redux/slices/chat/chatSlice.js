import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    value: []
  },
  reducers: {
    incremented(state){
      state.value.push()
    },
    addMsg(state , action ) {
      state.value.push(action.payload)
    }
  }
})

export const { incremented , addMsg  } = chatSlice.actions
export default chatSlice.reducer

const store = configureStore({
  reducer: chatSlice.reducer
})

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()))

// Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// {value: 1}
// store.dispatch(incremented())
// {value: 2}
// {value: 1}