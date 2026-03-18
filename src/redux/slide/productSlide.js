import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search: '', // Lưu trữ từ khóa người dùng gõ
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Hàm cập nhật từ khóa tìm kiếm khi người dùng gõ vào ô Input
    searchProduct: (state, action) => {
      state.search = action.payload
    },
  },
})

// Xuất hàm action để HeaderComponent gọi khi người dùng gõ
export const { searchProduct } = productSlice.actions

export default productSlice.reducer