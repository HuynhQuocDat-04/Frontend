import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './slide/CounterSlide'
import userReducer from './slide/userSlide'
import productReducer from './slide/productSlide' 
import orderReducer from './slide/orderSlide'

// Import các hàm cấu hình redux-persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Cấu hình persist: Lưu vào Local Storage, loại trừ state 'product'
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['product'] // Không lưu state product để tránh dính chữ ô tìm kiếm
}

// Gộp các reducer lại thành một rootReducer
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  product: productReducer, 
  order: orderReducer
})

// Bọc rootReducer bằng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Xuất persistor để bọc ứng dụng
export let persistor = persistStore(store)