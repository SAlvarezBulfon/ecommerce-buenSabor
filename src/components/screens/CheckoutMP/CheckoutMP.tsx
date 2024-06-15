import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PreferenceMP from '../../../types/mercadopago/PreferenceMP';
import { createPreferenceMP } from '../../../services/BackendClient';
import './CheckoutMP.css';



const CheckoutMP = () => {
  const [idPreference, setIdPreference] = useState<string>('');
  const navigate = useNavigate();

  const getPreferenceMP = async () => {
    const pedidoString = localStorage.getItem('pedido2');
    
   
    if (pedidoString) {
      const pedido = JSON.parse(pedidoString);
      console.log("pedido local", pedido)
      const response: PreferenceMP = await createPreferenceMP(pedido.id);
      console.log("Preference id: " + response.id);
      if (response) {
        setIdPreference(response.id);
      }
    } else {
      alert("Agregue al menos un producto al carrito");
    }
  };

  useEffect(() => {
    initMercadoPago('TEST-2bbca99c-f003-4787-b8c2-6282d340d911', { locale: 'es-AR' });
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
