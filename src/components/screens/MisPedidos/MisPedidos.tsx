import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Link } from 'react-router-dom';
import IPedido from '../../../types/IPedido';

import PedidoService from '../../../services/PedidoService';
import PedidoDetailModal from '../../ui/modals/PedidoDetailModal';
import { useAuth0 } from '@auth0/auth0-react';
import ICliente from '../../../types/ICliente';

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<IPedido | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const pedidoService = new PedidoService();
  const URL: string = import.meta.env.VITE_API_URL as string;
  const { user } = useAuth0();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (user?.email) {
          const response = await fetch(`${URL}/clientes/email/${encodeURIComponent(user.email)}`);
          if (!response.ok) {
            throw new Error('Error fetching client');
          }
          const cliente: ICliente = await response.json();
          console.log(cliente, "cliente");

          const pedidos = await pedidoService.getAll(`${URL}/clientes/pedidos/${cliente.id}`) as IPedido[];
          setPedidos(pedidos);
        }
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  /*useEffect(() => {
    const fetchPedidosByEstado = async () => {
      try {
        const pedidos = await pedidoService.getAll(`${URL}/pedido/findByEstado`);
        setPedidos(pedidos);
      } catch (error) {
        console.error('Error fetching pedidos by estado:', error);
      }
    };

    const intervalId = setInterval(fetchPedidosByEstado, 5000); // recargar cada 5 seconds

    return () => clearInterval(intervalId);
  }, [URL]);*/

  const handleOpenModal = (pedido: IPedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setModalOpen(false);
  };

  return (
    <div style={{ margin: '32px 32px 0 32px' }}>
      <Typography variant="h4" style={{ marginBottom: '16px' }}>Mis Pedidos</Typography>
      <List>
        {pedidos.map((pedido) => (
          <ListItem key={pedido.id} button onClick={() => handleOpenModal(pedido)} style={{ padding: '8px 16px' }}>
            <ListItemText primary={`Pedido #${pedido.id}`} secondary={`Abona en: ${pedido.formaPago}`} />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleOpenModal(pedido)}
                style={{ marginRight: '8px' }}
              >
                Ver Detalles
              </Button>
              <Button
                component={Link}
                to={`${URL}/facturas/factura/${pedido.id}`}
                variant="contained"
                color="error"
                size="small"
                disabled={pedido.estado !== 'FACTURADO'}
              >
                Factura
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <PedidoDetailModal open={modalOpen} onClose={handleCloseModal} pedido={selectedPedido} />
    </div>
  );
};

export default MisPedidos;
