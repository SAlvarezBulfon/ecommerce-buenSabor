import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Select, MenuItem, FormControl, InputLabel, TextField,
  Typography
} from '@mui/material';
import IPais from '../../../types/IPais';
import IProvincia from '../../../types/IProvincia';
import ILocalidad from '../../../types/ILocalidad';
import PaisService from '../../../services/PaisService';
import LocalidadService from '../../../services/LocalidadService';
import ProvinciaService from '../../../services/ProvinciaService';
import CartProduct from '../../../types/CartProduct';
import { TipoEnvio } from '../../../types/enums/TipoEnvio';
import { FormaPago } from '../../../types/enums/FormaPago';
import PedidoService from '../../../services/PedidoService';
import IPedido from '../../../types/IPedido';
import PedidoPost from '../../../types/post/PedidoPost';
import CheckoutMP from '../../screens/CheckoutMP/CheckoutMP';


interface ModalPedidoProps {
  open: boolean;
  onClose: () => void;
  product: CartProduct | null; 
  totalCost: number;
  cart: CartProduct[]; 
}

const ModalPedido: React.FC<ModalPedidoProps> = ({ open, onClose, product, totalCost, cart }) => {
  const [selectedTipoEnvio, setSelectedTipoEnvio] = useState<TipoEnvio | null>(null);
  const [selectedFormaPago, setSelectedFormaPago] = useState<FormaPago | null>(null); 
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<number>(0); 
  const [calle, setCalle] = useState<string>('');
  const [numero, setNumero] = useState<number | null>(null);
  const [cp, setCp] = useState<number | null>(null);
  const [piso, setPiso] = useState<number | null>(null);
  const [nroDpto, setNroDpto] = useState<number | null>(null);
  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
  const [finalCost, setFinalCost] = useState<number>(0); 
  const [pedidoConfirmed, setPedidoConfirmed] = useState<boolean>(false); // Nuevo estado para controlar si se confirmó el pedido
  const pedidoService = new PedidoService();
  const [finalizado, setFinalizado] = useState<boolean>(false);
  const [montoCarrito, setMontoCarrito] = useState<number>(0);
  const URL: string = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    if (selectedTipoEnvio === TipoEnvio.DELIVERY) {
      setSelectedFormaPago(FormaPago.MERCADO_PAGO);
    }
  }, [selectedTipoEnvio]);

  useEffect(() => {
    if (selectedTipoEnvio === TipoEnvio.TAKE_AWAY) {
      setFinalCost(totalCost * 0.9); 
    } else {
      setFinalCost(totalCost); 
    }
  }, [selectedTipoEnvio, totalCost]);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const paisService = new PaisService();
        const paises = await paisService.getAll('http://localhost:8080/pais');
        setPaises(paises);
      } catch (error) {
        console.error('Error fetching paises:', error);
      }
    };

    fetchPaises();
  }, []);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        if (selectedPais !== null) {
          const provinciaService = new ProvinciaService();
          const provincias = await provinciaService.getAll(`http://localhost:8080/provincia/findByPais/${selectedPais}`);
          setProvincias(provincias);
        }
      } catch (error) {
        console.error('Error fetching provincias:', error);
      }
    };

    fetchProvincias();
  }, [selectedPais]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        if (selectedProvincia !== null) {
          const localidadService = new LocalidadService();
          const localidades = await localidadService.getAll(`http://localhost:8080/localidad/findByProvincia/${selectedProvincia}`);
          setLocalidades(localidades);
        }
      } catch (error) {
        console.error('Error fetching localidades:', error);
      }
    };

    fetchLocalidades();
  }, [selectedProvincia]);

  const handlePaisChange = (event: any) => {
    const paisId = event.target.value;
    setSelectedPais(paisId);
    setSelectedProvincia(null);
    setSelectedLocalidad(0);
    setProvincias([]);
    setLocalidades([]);
  };

  const handleProvinciaChange = (event: any) => {
    const provinciaId = event.target.value;
    setSelectedProvincia(provinciaId);
    setSelectedLocalidad(0);
    setLocalidades([]);
  };

  const handleLocalidadChange = (event: any) => {
    const localidadId = event.target.value;
    setSelectedLocalidad(localidadId);
  };
  
  const handleSubmit = async () => {
    try {
      let idDomicilio: number | undefined = undefined; // Inicializa como undefined
      if (selectedLocalidad !== null) {
          idDomicilio = parseInt(selectedLocalidad.toString()); // Convierte a number si no es null
      }
    
      const pedidoPost: PedidoPost = {
        total: parseFloat(totalCost.toFixed(2)),
        totalCosto: parseFloat(finalCost.toFixed(2)),
        tipoEnvio: TipoEnvio.DELIVERY,
        formaPago: FormaPago.EFECTIVO,
        detallePedidos: cart.map((item) => ({
            cantidad: item.quantity,
            subTotal: finalCost,
            idArticulo: item.id
        })),
        idCliente: 1, // Cliente harcodeado
        idDomicilio: idDomicilio ?? 0, 
    };
    
    try {
      await pedidoService.post(`${URL}/pedido`, pedidoPost) as PedidoPost;
      setPedidoConfirmed(true); // Marcar el pedido como confirmado
      alert('Pedido realizado exitosamente');
      setMontoCarrito(totalCost);
      setFinalizado(true);
  } catch (error) {
      console.error('Error al realizar el pedido:', error);
      alert('Error al realizar el pedido');
  }
  
    } catch (error) {
      
        console.error('Error al enviar el pedido:', error);
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
            value={selectedTipoEnvio}
            onChange={(e) => setSelectedTipoEnvio(e.target.value as TipoEnvio)}
            label="Tipo de Envío"
          >
            <MenuItem value={TipoEnvio.DELIVERY}>Delivery</MenuItem>
            <MenuItem value={TipoEnvio.TAKE_AWAY}>Retiro en el local</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="forma-pago-label">Forma de Pago</InputLabel>
          <Select
            labelId="forma-pago-label"
            value={selectedFormaPago}
            onChange={(e) => setSelectedFormaPago(e.target.value as FormaPago)}
            label="Forma de Pago"
            disabled={selectedTipoEnvio === TipoEnvio.DELIVERY}
          >
            <MenuItem value={FormaPago.EFECTIVO}>Efectivo</MenuItem>
            <MenuItem value={FormaPago.MERCADO_PAGO}>Mercado Pago</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body1" color="textPrimary" style={{ marginTop: '16px' }}>
          Total Costo: ${finalCost.toFixed(2)}
        </Typography>
        {selectedTipoEnvio === TipoEnvio.DELIVERY && (
          <>
            <Typography variant="h6" color="textPrimary" style={{ marginBottom: '24px', marginTop: '24px' }}>
              ¡Ingresa la ubicación a la que deseas que se envíe el pedido!
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="pais-label">País</InputLabel>
              <Select
                labelId="pais-label"
                value={selectedPais || ''}
                onChange={handlePaisChange}
                label="País"
              >
                {paises.map((pais) => (
                  <MenuItem key={pais.id} value={pais.id}>
                    {pais.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedPais &&  selectedTipoEnvio === TipoEnvio.DELIVERY && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="provincia-label">Provincia</InputLabel>
                <Select
                  labelId="provincia-label"
                  value={selectedProvincia || ''}
                  onChange={handleProvinciaChange}
                  label="Provincia"
                >
                  {provincias.map((provincia) => (
                    <MenuItem key={provincia.id} value={provincia.id}>
                      {provincia.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedProvincia && selectedTipoEnvio === TipoEnvio.DELIVERY && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="localidad-label">Localidad</InputLabel>
                <Select
                  labelId="localidad-label"
                  value={selectedLocalidad || ''}
                  onChange={handleLocalidadChange}
                  label="Localidad"
                >
                  {localidades.map((localidad) => (
                    <MenuItem key={localidad.id} value={localidad.id}>
                      {localidad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedLocalidad && selectedTipoEnvio === TipoEnvio.DELIVERY && (
              <>
                <TextField
                  label="Calle"
                  fullWidth
                  margin="normal"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                />
                <TextField
                  label="Número"
                  fullWidth
                  margin="normal"
                  value={numero || ''}
                  onChange={(e) => setNumero(parseInt(e.target.value))}
                  type="number"
                />
                <TextField
                  label="Código Postal"
                  fullWidth
                  margin="normal"
                  value={cp || ''}
                  onChange={(e) => setCp(parseInt(e.target.value))}
                  type="number"
                />
                <TextField
                  label="Piso"
                  fullWidth
                  margin="normal"
                  value={piso || ''}
                  onChange={(e) => setPiso(parseInt(e.target.value))}
                  type="number"
                />
                <TextField
                  label="Número de Departamento"
                  fullWidth
                  margin="normal"
                  value={nroDpto || ''}
                  onChange={(e) => setNroDpto(parseInt(e.target.value))}
                  type="number"
                />
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
      
        
        {finalizado ? (
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
