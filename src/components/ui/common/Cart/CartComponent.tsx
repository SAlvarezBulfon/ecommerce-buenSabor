import React, { useEffect, useState } from 'react';
import { Button, Typography, ListItem, List, Drawer, ListItemText } from '@mui/material';
import CartProduct from '../../../../types/CartProduct';
import IProducto from '../../../../types/IProducto';
import ModalPedido from '../../modals/ModalPedido';


interface CartComponentProps {
  cart: CartProduct[];
  open: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, products: IProducto[]) => void;
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ cart, open, onClose, onAddToCart, onRemoveFromCart, onClearCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar si el modal está abierto
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null); // Estado para almacenar el producto seleccionado

  const shippingCost = 1200;
  const total = cart.reduce((sum, product) => sum + product.precioVenta * product.quantity, 0).toFixed(2);
  const totalCost = (parseFloat(total) + shippingCost).toFixed(2);

  const handleRealizarPedido = (product: CartProduct) => {
    setSelectedProduct(product); // Almacena el producto seleccionado
    setIsModalOpen(true); // Abre el modal al hacer clic en "Realizar Pedido"
  };

  return (
    <>
    <Drawer anchor="right" open={open} onClose={onClose}>
        <List sx={{ width: 300 }}>
          <ListItem>
            <Typography variant="h6">Carrito de Compras</Typography>
          </ListItem>
          {cart.map((product) => (
            <ListItem key={product.id}>
              <ListItemText
                primary={product.denominacion}
                secondary={`$${product.precioVenta} x ${product.quantity}`}
              />
              <Button
                onClick={() => onAddToCart(product.id, cart)}
                size="small"
              >
                +
              </Button>
              <Button
                onClick={() => onRemoveFromCart(product.id)}
                size="small"
              >
                -
              </Button>
            </ListItem>
          ))}
          <ListItem>
            <Typography variant="body1">Total: ${total}</Typography>
          </ListItem>
          {cart.map((product) => (
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleRealizarPedido(product)}// Abre el modal al hacer clic en "Realizar Pedido"
            >
              Realizar Pedido
            </Button>
          </ListItem>
          ))}
          <ListItem>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={onClearCart}
            >
              Vaciar Carrito
            </Button>
          </ListItem>
        </List>
      </Drawer>
       <ModalPedido
       open={isModalOpen} // Estado para controlar si el modal está abierto
       onClose={() => setIsModalOpen(false)} // Función para cerrar el modal
       product={selectedProduct} // Pasa el producto seleccionado al modal
       totalCost={parseFloat(totalCost)} // Pasar el totalCost como una prop al modal
       cart={cart} // Pasar el estado del carrito como una prop al modal
     />
     </>
  );
};

export default CartComponent;