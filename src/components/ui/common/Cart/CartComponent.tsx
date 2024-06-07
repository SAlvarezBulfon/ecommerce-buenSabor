import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import IProducto from '../../../../types/IProducto';
import CartProduct from '../../../../types/CartProduct';

interface CartComponentProps {
  cart: CartProduct[];
  open: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, products: IProducto[]) => void; 
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void; 
}

const CartComponent: React.FC<CartComponentProps> = ({ cart, open, onClose, onAddToCart, onRemoveFromCart, onClearCart }) => {
  const [paymentMethod, setPaymentMethod] = useState('EFECTIVO');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const shippingCost = 1200;
  const total = cart.reduce((sum, product) => sum + product.precioVenta * product.quantity, 0).toFixed(2);
  const totalCost = (parseFloat(total) + shippingCost).toFixed(2);

  const handlePlaceOrder = () => {
    const orderData = {
      horaEstimadaFinalizacion: new Date(Date.now() + 3600000).toLocaleTimeString(), 
      total: parseFloat(total),
      totalCosto: parseFloat(totalCost),
      estado: 'PREPARACION',
      tipoEnvio: 'DELIVERY',
      formaPago: paymentMethod,
      fechaPedido: new Date().toISOString().split('T')[0], 
      idSucursal: 0 
    };

    fetch('http://localhost:8080/pedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      setOrderDetails(data);
      setDialogOpen(true);
      onClearCart();
      onClose();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
              <ListItemText primary={product.descripcion} secondary={`$${product.precioVenta} x ${product.quantity}`} />
              <Button onClick={() => onRemoveFromCart(product.id)}>-</Button>
              <Button onClick={() => onAddToCart(product.id, cart)}>+</Button>
            </ListItem>
          ))}
          <ListItem>
            <Typography variant="subtitle1">Total: ${total}</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="subtitle1">Costo de Envío: ${shippingCost}</Typography>
          </ListItem>
          <ListItem>
            <Typography variant="subtitle1">Total Costo: ${totalCost}</Typography>
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Forma de Pago</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                <MenuItem value="MERCADO_PAGO">Mercado Pago</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button variant="outlined" color="primary" fullWidth onClick={onClearCart}>
              Vaciar carrito
            </Button>
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" fullWidth onClick={handlePlaceOrder}>
              Realizar pedido
            </Button>
          </ListItem>
        </List>
      </Drawer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Pedido</DialogTitle>
        <DialogContent>
          {orderDetails && (
            <>
              <Typography variant="body1">Total Costo: ${orderDetails.totalCosto}</Typography>
              <Typography variant="body1">Forma de Pago: {orderDetails.formaPago}</Typography>
              <Typography variant="body1">Tiempo Estimado: {orderDetails.horaEstimadaFinalizacion}</Typography>
              <Typography variant="body1">Fecha: {orderDetails.fechaPedido}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartComponent;
