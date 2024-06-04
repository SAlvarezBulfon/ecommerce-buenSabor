import { useState, useEffect } from 'react';
import IProducto from '../types/IProducto';
import CartProduct from '../types/CartProduct';

const useCartLogic = () => {
  const [cart, setCart] = useState<CartProduct[]>(
    () => JSON.parse(localStorage.getItem('cart') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: number, products: IProducto[]) => {
    const existingProductIndex = cart.findIndex((item) => item.id === productId);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      const productToAdd = products.find((product) => product.id === productId);
      if (productToAdd) {
        setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (productId: number) => {
    const existingProductIndex = cart.findIndex((item) => item.id === productId);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity -= 1;
      if (updatedCart[existingProductIndex].quantity === 0) {
        updatedCart.splice(existingProductIndex, 1);
      }
      setCart(updatedCart);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return { cart, addToCart, removeFromCart, clearCart };
};

export default useCartLogic;
