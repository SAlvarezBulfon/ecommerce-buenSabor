import React from 'react';
import { AppBar, Toolbar, Typography, Link as MuiLink, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Link } from 'react-router-dom';
import CartProduct from '../../../../types/CartProduct';

interface NavbarProps {
  cart: CartProduct[];
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cart, onCartClick }) => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <MuiLink component={Link} to="/" underline="none" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FastfoodIcon />
          <Typography variant="h6">Buen Sabor</Typography>
        </MuiLink>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <CustomLink to="/">Inicio</CustomLink>
            <CustomLink to="/productos">Tienda</CustomLink>
            <CustomLink to="/categorias">Categorías</CustomLink>
          </nav>
          <IconButton color="inherit" onClick={onCartClick}>
            <Badge badgeContent={cart.reduce((acc, item) => acc + item.quantity, 0)} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, children }) => {
  return (
    <MuiLink component={Link} to={to} color="inherit" underline="none" variant="button">
      {children}
    </MuiLink>
  );
};

export default Navbar;
