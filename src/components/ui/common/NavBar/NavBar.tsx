import React, {useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Avatar, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Link, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import CartProduct from '../../../../types/CartProduct';
import AuthButtons from './AuthButtons';
import NavLinks from './NavLinks';
import useClienteRegistrationVerification from '../../../../hooks/useClienteRegistrationVerification ';


interface NavbarProps {
  cart: CartProduct[];
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cart, onCartClick }) => {
  const { isAuthenticated, logout, user } = useAuth0();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isRegistered = useClienteRegistrationVerification();

  const handleCartClick = () => {
    if (isAuthenticated) {
      onCartClick();
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FastfoodIcon />
            <Typography variant="h6">Buen Sabor</Typography>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && isRegistered ? ( 
            <>
              <NavLinks />
              <IconButton color="inherit" onClick={handleCartClick}>
                <Badge badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Avatar alt={user?.name || ""} src={user?.picture || ""} />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={handleProfileMenuClose}>Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </>
          ) : isAuthenticated && !isRegistered ? ( // Redirigir al registro si está autenticado pero no registrado
            <Navigate to="/registro" />
          ) : ( // Mostrar el navbar de inicio de sesión si no está autenticado
            <AuthButtons isAuthenticated={isAuthenticated} />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
