import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/ui/common/NavBar/NavBar';
import useCartLogic from '../utils/cartLogic';
import CartComponent from '../components/ui/common/Cart/CartComponent';
import ProductosPage from '../components/screens/Products/ProductsPage';
import { productosEjemplo } from '../utils/productosEjemplo';
import IProducto from '../types/IProducto';
import Main from '../components/screens/Landing/Main';

const Rutas: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCartLogic();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <div>
        <Navbar cart={cart} onCartClick={() => setIsCartOpen(true)} />
        <CartComponent
          cart={cart}
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onAddToCart={(productId) => addToCart(productId, productosEjemplo)}
          onRemoveFromCart={removeFromCart}
        />
        <Routes>
        <Route
            path="/"
            element={
              <Main />
            }
          />
          <Route
            path="/productos"
            element={
              <ProductosPage
                products={productosEjemplo}
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
