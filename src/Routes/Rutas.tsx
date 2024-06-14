import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../components/ui/common/NavBar/NavBar';
import useCartLogic from '../utils/cartLogic';
import CartComponent from '../components/ui/common/Cart/CartComponent';
import ProductosPage from '../components/screens/Products/ProductsPage';
import Main from '../components/screens/Landing/Main';
import RegisterForm from '../components/screens/Registro/RegisterForm';
import CallbackPage from '../components/auth/CallbackPage';

import IProducto from '../types/IProducto';
import { RootState } from '../redux/store/store';
import MisPedidos from '../components/screens/MisPedidos/MisPedidos';

const Rutas: React.FC = () => {
  const navigate = useNavigate();
  const productos = useSelector((state: RootState) => state.productos.data);
  const { cart, addToCart, removeFromCart, clearCart } = useCartLogic();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isAuthenticated, user } = useAuth0();
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);


  useEffect(() => {
    const checkRegistration = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/clientes/email/${encodeURIComponent(user.email)}`
          );

          const isUserRegistered = response.headers.get('content-length') !== '0';
          setIsRegistered(isUserRegistered);
        } catch (error) {
          console.error('Error en la solicitud de verificación del email del cliente:', error);
          setIsRegistered(false);
        }
      } else {
        setIsRegistered(false);
      }
    };

    checkRegistration();
  }, [isAuthenticated, user?.email, navigate]);

  if (isRegistered === null) {
    return <div>Cargando...</div>; 
  }

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
        <Route
          path="/productos"
          element={
            isAuthenticated && isRegistered ? (
              <ProductosPage
                addToCart={(productId: number, products: IProducto[]) => addToCart(productId, products)}
              />
            ) : (
              <Navigate to="/registro" />
            )
          }
        />
        <Route
          path="/registro"
          element={
            isAuthenticated && isRegistered === false ? <RegisterForm /> : <Navigate to="/" />
          }
        />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/" element={<Main />} />
        <Route
          path="/mispedidos"
          element={
            isAuthenticated && isRegistered ? <MisPedidos /> : <Navigate to="/registro" />
          }
        />
      </Routes>
    </div>
  );
};

export default Rutas;
