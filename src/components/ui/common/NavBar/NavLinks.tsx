import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const NavLinks: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav style={{ display: 'flex', gap: '16px' }}>
      <CustomLink to="/">Inicio</CustomLink>
      {isAuthenticated && <CustomLink to="/productos">Tienda</CustomLink>}
    </nav>
  );
};

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, children }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      {children}
    </Link>
  );
};

export default NavLinks;
