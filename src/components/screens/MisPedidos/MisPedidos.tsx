import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Link } from 'react-router-dom';
import IPedido from '../../../types/IPedido';

import PedidoService from '../../../services/PedidoService';
import PedidoDetailModal from '../../ui/modals/PedidoDetailModal';

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<IPedido | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const pedidoService = new PedidoService();
  const URL: string = import.meta.env.VITE_API_URL as string;


  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidos = await pedidoService.getAll(`${URL}/pedido`);
       //const pedidos = await pedidoService.getAll(`${URL}/clientes/pedidos/${clienteId}`);
        setPedidos(pedidos);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
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
  }, [URL]);

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
