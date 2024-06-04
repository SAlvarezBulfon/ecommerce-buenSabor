import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import IProducto from '../../../../types/IProducto';
import CartProduct from '../../../../types/CartProduct';

interface CartComponentProps {
  cart: CartProduct[];
  open: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, products: IProducto[]) => void; 
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void; // Agrega la prop para vaciar el carrito
}

const CartComponent: React.FC<CartComponentProps> = ({ cart, open, onClose, onAddToCart, onRemoveFromCart, onClearCart }) => {
  const total = cart.reduce((sum, product) => sum + product.precioVenta * product.quantity, 0).toFixed(2);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List sx={{ width: 300 }}>
        <ListItem>
          <Typography variant="h6">Carrito de Compras</Typography>
        </ListItem>
        {cart.map((product) => (
          <ListItem key={product.id}>
            <ListItemText primary={product.descripcion} secondary={`$${product.precioVenta} x ${product.quantity}`} />
            <Button onClick={() => onRemoveFromCart(product.id)}>-</Button>
            <Button onClick={() => onAddToCart(product.id, cart)}>+</Button>
          </ListItem>
        ))}
        <ListItem>
          <Typography variant="subtitle1">Total: ${total}</Typography>
        </ListItem>
        <ListItem>
        <Button variant="outlined" color="primary" fullWidth onClick={onClearCart}>
            Vaciar carrito
          </Button>
        </ListItem>
        <ListItem>
          <Button variant="contained" color="primary" fullWidth>
            Realizar pedido
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default CartComponent;
