import { configureStore } from '@reduxjs/toolkit'
import ProductoReducer from '../slices/ProductoReducer'
import ModalReducer from '../slices/ModalReducer'
import CategoriaReducer from '../slices/CategoriaReducer'
import PedidoReducer from '../slices/PedidoReducer'


export const store = configureStore({
  reducer: {
    productos: ProductoReducer,
    modal: ModalReducer,
    categorias: CategoriaReducer,
    pedidos:PedidoReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch