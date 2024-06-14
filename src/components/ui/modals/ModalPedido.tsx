import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Select, MenuItem, FormControl, InputLabel, 
  Typography
} from '@mui/material';
import IPais from '../../../types/IPais';
import IProvincia from '../../../types/IProvincia';
import ILocalidad from '../../../types/ILocalidad';
import CartProduct from '../../../types/CartProduct';
import PedidoService from '../../../services/PedidoService';
import PedidoPost from '../../../types/post/PedidoPost';
import CheckoutMP from '../../screens/CheckoutMP/CheckoutMP';
import DomicilioService from '../../../services/DomicilioService';
import ICliente from '../../../types/ICliente';
import { useAuth0 } from '@auth0/auth0-react';
import ClienteService from '../../../services/ClienteService';
import IDomicilio from '../../../types/IDomicilio';

interface ModalPedidoProps {
  open: boolean;
  onClose: () => void;
  product: CartProduct | null;
  totalCost: number;
  cart: CartProduct[];
}

const ModalPedido: React.FC<ModalPedidoProps> = ({ open, onClose, totalCost, cart }) => {
  const [selectedTipoEnvio, setSelectedTipoEnvio] = useState<string | null>(null); 
  const [selectedFormaPago, setSelectedFormaPago] = useState<string | null>(null); 

  const [finalCost, setFinalCost] = useState<number>(0);
  const [pedidoConfirmed, setPedidoConfirmed] = useState<boolean>(false);
  const pedidoService = new PedidoService();
  const [finalizado, setFinalizado] = useState<boolean>(false);
  const [montoCarrito, setMontoCarrito] = useState<number>(0);
  const URL: string = import.meta.env.VITE_API_URL as string;
  const domicilioService = new DomicilioService();
  const clienteService = new ClienteService();
  const [clienteId, setClienteId] = useState<ICliente[]>([]);
  const [domicilioId,setDomicilio] = useState<IDomicilio[]>([]);
  const { user } = useAuth0();
  
  useEffect(() => {
    if (selectedTipoEnvio === "DELIVERY") {
      setSelectedFormaPago("MERCADO_PAGO");
    }
  }, [selectedTipoEnvio]);

  useEffect(() => {
    if (selectedTipoEnvio === "TAKE_AWAY") {
      setFinalCost(totalCost * 0.9);
    } else {
      setFinalCost(totalCost);
    }
  }, [selectedTipoEnvio, totalCost]);

  
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        if (user?.email) {
          const response = await fetch(`${URL}/clientes/email/${encodeURIComponent(user.email)}`);
          if (!response.ok) {
            throw new Error('Error fetching client');
          }
          const cliente: ICliente = await response.json();
          console.log(cliente, "cliente");
         
          const clientes = await clienteService.getAll(`${URL}/clientes/${cliente.id}`) as ICliente[];
          setClienteId(clientes);
        }
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchCliente();
  }, []);
  useEffect(() => {
    const fetchDomicilio = async () => {
      try {
        if (user?.email) {
          const response = await fetch(`${URL}/clientes/email/${encodeURIComponent(user.email)}`);
          if (!response.ok) {
            throw new Error('Error fetching client');
          }
          const cliente: ICliente = await response.json();
          console.log(cliente, "cliente");

          const domicilio = await domicilioService.getAll(`${URL}/clientes/domicilios/${cliente.id}`) as IDomicilio[];
          setDomicilio(domicilio);
        }
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchDomicilio();
  }, []);

  const handleSubmit = async () => {
    try {
      console.log('Cliente ID:', clienteId);
      console.log('Domicilio ID:', domicilioId);
  
      if (clienteId.length === 0 || domicilioId.length === 0) {
        throw new Error('Cliente o domicilio no encontrados');
      }
  
      const clienteIdToUse = clienteId[0]?.id; // Usando optional chaining para acceder al ID
      const domicilioIdToUse = domicilioId[0]?.id; // Usando optional chaining para acceder al ID
  
      console.log('Cliente ID a usar:', clienteIdToUse);
      console.log('Domicilio ID a usar:', domicilioIdToUse);
  
      if (!clienteIdToUse || !domicilioIdToUse) {
        throw new Error('ID de cliente o domicilio no válidos');
      }
  
      const pedidoPost: PedidoPost = {
        tipoEnvio: selectedTipoEnvio!,
        formaPago: selectedFormaPago!,
        detallePedidos: cart.map((item) => ({
          cantidad: item.quantity,
          subTotal: parseFloat(totalCost.toFixed(2)),
          idArticulo: item.id
        })),
        idCliente: clienteIdToUse,
        idDomicilio: domicilioIdToUse,
      };
  
      console.log('Sending pedidoPost:', JSON.stringify(pedidoPost, null));
  
      await pedidoService.post(`${URL}/pedido`, pedidoPost) as PedidoPost;
      setPedidoConfirmed(true);
      alert('Pedido realizado exitosamente');
      setMontoCarrito(totalCost);
      setFinalizado(true);
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
      alert('Error al realizar el pedido');
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Continuar Pedido</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary">
          ¡Si retira en el local, obtiene un 10% de descuento!
        </Typography>
      </DialogContent>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="tipo-envio-label">Tipo de Envío</InputLabel>
          <Select
            labelId="tipo-envio-label"
            value={selectedTipoEnvio || ''}
            onChange={(e) => setSelectedTipoEnvio(e.target.value as string)}
            label="Tipo de Envío"
          >
            <MenuItem value="DELIVERY">Delivery</MenuItem>
            <MenuItem value="TAKE_AWAY">Retiro en el local</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="forma-pago-label">Forma de Pago</InputLabel>
          <Select
            labelId="forma-pago-label"
            value={selectedFormaPago || ''}
            onChange={(e) => setSelectedFormaPago(e.target.value as string)}
            label="Forma de Pago"
            disabled={selectedTipoEnvio === "DELIVERY"}
          >
            <MenuItem value="EFECTIVO">Efectivo</MenuItem>
            <MenuItem value="MERCADO_PAGO">Mercado Pago</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body1" color="textPrimary" style={{ marginTop: '16px' }}>
          Total Costo: ${finalCost.toFixed(2)}
        </Typography>
      </DialogContent>
      <DialogActions>
        {!finalizado ? (
          <Button onClick={handleSubmit} color="primary">
            Confirmar Pedido
          </Button>
        ) : (
          <CheckoutMP montoCarrito={montoCarrito} />
        )}
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPedido;
