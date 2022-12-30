import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const initializeUser = (user) => {
  return async (dispatch) => {
    dispatch(setUser(user))
  }
}

export const removeUser = () => {
  return async (dispatch) => {
    dispatch(clearUser())
  }
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
