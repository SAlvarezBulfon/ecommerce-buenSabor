import React, { useState } from 'react';
import { Typography, TextField, Box, Container, Grid } from '@mui/material';
import IProducto from '../../../types/IProducto';
import ProductCard from '../../ui/Cards/ProductCard';

interface ProductosPageProps {
  products: IProducto[];
  addToCart: (productId: number, products: IProducto[]) => void; // Corregir el tipo de addToCart
}

const ProductosPage: React.FC<ProductosPageProps> = ({ products, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <Typography variant="h3" gutterBottom>
          Delicias Rápidas
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Encuentra tu comida favorita en nuestra tienda
        </Typography>
        <TextField
          fullWidth
          label="Buscar productos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: 20 }}
        />
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '100%', width: '100%' }}
              >
                <ProductCard product={product} addToCart={(productId: number, products: IProducto[]) => addToCart(productId, products)} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductosPage;
