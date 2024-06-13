import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
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
        setPedidos(pedidos);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const handleOpenModal = (pedido: IPedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setModalOpen(false);
  };

  return (
    <div>
      <Typography variant="h4">Mis Pedidos</Typography>
      <List>
        {pedidos.map((pedido) => (
          <ListItem key={pedido.id} button onClick={() => handleOpenModal(pedido)}>
            <ListItemText primary={`Pedido #${pedido.id}`} secondary={`Abona en: ${pedido.formaPago}`} />
            <ListItemSecondaryAction>
              <Button variant="contained" color="primary" onClick={() => handleOpenModal(pedido)}>
                Ver Detalles
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
