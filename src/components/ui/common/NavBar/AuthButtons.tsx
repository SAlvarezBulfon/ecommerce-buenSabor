import React from 'react';
import { Button, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isAuthenticated }) => {
  const { loginWithRedirect, logout } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({logoutParams: { returnTo: '/' }});
  };

  return (
    <Box display="flex" gap={1}>
      {isAuthenticated ? (
        <Button color="secondary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      ) : (
        <>
          <Button variant='contained' color="secondary" onClick={handleLogin}>
            Iniciar sesión
          </Button>
          <Button variant='contained' color="secondary" onClick={handleLogin}>
            Registrarse
          </Button>
        </>
      )}
    </Box>
  );
};

export default AuthButtons;
