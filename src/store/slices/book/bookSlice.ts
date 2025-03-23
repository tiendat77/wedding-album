import { createSlice } from '@reduxjs/toolkit';

export interface BookState {
  page: number;
  total: number;
}

const initialState: BookState = {
  page: 0,
  total: 0,
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTotalPage: (state, action) => {
      state.total = action.payload;
    },
  },
});

export const { setPage, setTotalPage } = bookSlice.actions;

export default bookSlice.reducer;
