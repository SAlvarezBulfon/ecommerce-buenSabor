import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Rutas from './Routes/Rutas';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import './App.css'; // Asegúrate de importar tus estilos

const App: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isWithinBusinessHours()) {
      setShowAlert(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        {showAlert ? (
          <div className="alert">
            Fuera del horario de atención. Nuestro horario de atención es de lunes a viernes de 12:00 a 20:00, y de sábados a domingos de 11:00 a 15:00.
          </div>
        ) : (
          <Rutas />
        )}
      </Provider>
    </ThemeProvider>
  );
};

const isWithinBusinessHours = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  if (day >= 1 && day <= 5) { // Lunes a viernes
    return (hour > 12 || (hour === 12 && minutes >= 0)) && (hour < 20 || (hour === 20 && minutes === 0));
  } else { // Sábado y domingo
    return (hour > 11 || (hour === 11 && minutes >= 0)) && (hour < 15 || (hour === 15 && minutes === 0));
  }
};

export default App;
