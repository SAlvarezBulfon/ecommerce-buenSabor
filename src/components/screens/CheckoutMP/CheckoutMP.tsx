import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PreferenceMP from '../../../types/mercadopago/PreferenceMP';
import Pedido from '../../../types/IPedido';
import { createPreferenceMP } from '../../../services/BackendClient';
import { TipoEnvio } from '../../../types/enums/TipoEnvio';
import { FormaPago } from '../../../types/enums/FormaPago';
import './CheckoutMP.css';

interface CheckoutMPProps {
  montoCarrito: number;
}

const CheckoutMP: React.FC<CheckoutMPProps> = ({ montoCarrito }) => {
  const [idPreference, setIdPreference] = useState<string>('');
  const navigate = useNavigate();

  const getPreferenceMP = async () => {
    if (montoCarrito > 0) {
      const pedido: Pedido = {
        id: 0, 
        fechaPedido: new Date().toISOString(),
        total: montoCarrito, 
        totalCosto: montoCarrito,
        tipoEnvio: TipoEnvio.DELIVERY,
        formaPago: FormaPago.EFECTIVO,
        detallePedidos: [], 
        idCliente: 0,
        idDomicilio: 0
      };

      const response: PreferenceMP = await createPreferenceMP(pedido);
      console.log("Preference id: " + response.id);
      if (response) {
        setIdPreference(response.id);
      }
    } else {
      alert("Agregue al menos un producto al carrito");
    }
  };

  useEffect(() => {
    initMercadoPago('TEST-5b58b558-60aa-484c-8fff-a76c3e78d96a', { locale: 'es-AR' });
  }, []);

  return (
    <div>
      <button onClick={getPreferenceMP} className='btMercadoPago'>COMPRAR con <br></br> Mercado Pago</button>
      <div className={idPreference ? 'divVisible' : 'divInvisible'} >
        <Wallet initialization={{ preferenceId: idPreference, redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />
      </div>
      <button onClick={() => navigate('/')} className='btVolver'>Volver al Inicio</button>
    </div>
  );
};

export default CheckoutMP;
