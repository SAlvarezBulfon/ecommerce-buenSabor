// src/routes/Rutas.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/ui/common/NavBar/NavBar';
import useCartLogic from '../utils/cartLogic';
import CartComponent from '../components/ui/common/Cart/CartComponent';
import ProductosPage from '../components/screens/Products/ProductsPage';
import Main from '../components/screens/Landing/Main';
import { fetchProductos } from '../redux/thunks/productoThunks';

import IProducto from '../types/IProducto';
import { AppDispatch, RootState } from '../redux/store/store';

const Rutas: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const productos = useSelector((state: RootState) => state.productos.data);
  const { cart, addToCart, removeFromCart, clearCart } = useCartLogic(); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductos()).catch(error => {
      console.error('Error al despachar fetchProductos:', error);
    });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Navbar cart={cart} onCartClick={() => setIsCartOpen(true)} />
        <CartComponent
          cart={cart}
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onAddToCart={(productId) => addToCart(productId, productos)}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearCart} 
        />
        <Routes>
          <Route
            path="/"
            element={<Main />}
          />
          <Route
            path="/productos"
            element={
              <ProductosPage
                products={productos}
                addToCart={(productId: number, products: IProducto[]) => addToCart(productId, products)}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default Rutas;
