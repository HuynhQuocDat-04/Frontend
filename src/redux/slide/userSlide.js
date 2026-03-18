import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    city: '',
    id: '',
    access_token: '',
    isAdmin: false,
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            // Sử dụng toán tử spread để giữ lại giá trị cũ nếu field mới không truyền vào
            const { 
                name, email, access_token, address, phone, avatar, _id, id, isAdmin, city 
            } = action.payload;

            state.name = name || state.name;
            state.email = email || state.email;
            state.address = address || state.address;
            state.phone = phone || state.phone;
            state.avatar = avatar || state.avatar;
            state.id = _id || id || state.id; // Chấp nhận cả _id từ MongoDB hoặc id từ payload
            state.access_token = access_token || state.access_token;
            state.isAdmin = isAdmin !== undefined ? isAdmin : state.isAdmin;
            state.city = city || state.city;
        },
        
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.access_token = '';
            state.id = '';
            state.isAdmin = false;
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.city = '';
        },
    },
})

export const { updateUser, resetUser } = userSlide.actions
export default userSlide.reducer