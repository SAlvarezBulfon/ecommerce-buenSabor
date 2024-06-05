import { configureStore } from '@reduxjs/toolkit'
import ProductoReducer from '../slices/ProductoReducer'
import ModalReducer from '../slices/ModalReducer'
import CategoriaReducer from '../slices/CategoriaReducer'


export const store = configureStore({
  reducer: {
    productos: ProductoReducer,
    modal: ModalReducer,
    categorias: CategoriaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch