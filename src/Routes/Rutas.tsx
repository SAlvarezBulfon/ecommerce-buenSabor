import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/ui/common/NavBar/NavBar';
import useCartLogic from '../utils/cartLogic';
import CartComponent from '../components/ui/common/Cart/CartComponent';
import ProductosPage from '../components/screens/Products/ProductsPage';
import Main from '../components/screens/Landing/Main';
import RegisterForm from '../components/screens/Registro/RegisterForm';
import CallbackPage from '../components/auth/CallbackPage';
import { fetchProductos } from '../redux/thunks/productoThunks';
import IProducto from '../types/IProducto';
import { AppDispatch, RootState } from '../redux/store/store';


const Rutas: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const productos = useSelector((state: RootState) => state.productos.data);
  const { cart, addToCart, removeFromCart, clearCart } = useCartLogic();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isAuthenticated, user } = useAuth0();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    dispatch(fetchProductos()).catch(error => {
      console.error('Error al despachar fetchProductos:', error);
    });
  }, [dispatch]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (isAuthenticated && user?.email) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/clientes/email/${encodeURIComponent(user.email)}`
        );

        setIsRegistered(response.ok);
      } else {
        setIsRegistered(false);
      }
    };

    checkRegistration();
  }, [isAuthenticated, user?.email]);

  return (
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
        <Route path="/productos" element={
          isAuthenticated && isRegistered ? (
            <ProductosPage products={productos} addToCart={(productId: number, products: IProducto[]) => addToCart(productId, products)} />
          ) : (
            <Navigate to="/registro" />
          )
        } />
        <Route path="/registro" element={
          isAuthenticated && isRegistered === false ? <RegisterForm /> : <Navigate to="/" />
        } />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </div>
  );
};

export default Rutas;
