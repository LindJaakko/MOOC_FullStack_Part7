import { createSlice } from '@reduxjs/toolkit'

const initialState = null
let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    activateNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    },
  },
})

export const setNotification = (content, time) => {
  return async (dispatch) => {
    dispatch(activateNotification(content))
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }
}

export const { activateNotification, clearNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
