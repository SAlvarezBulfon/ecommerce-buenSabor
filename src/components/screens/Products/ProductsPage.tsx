import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, Container, Grid, Button, CircularProgress } from '@mui/material';
import IProducto from '../../../types/IProducto';
import ProductCard from '../../ui/Cards/ProductCard';
import ProductoService from '../../../services/ProductoService';

const productoService = new ProductoService();

interface ProductosPageProps {
  addToCart: (productId: number, products: IProducto[]) => void;
}

const ProductosPage: React.FC<ProductosPageProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<IProducto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10; 
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productoService.getPaginatedProducts(page, pageSize, url + '/eCommerce/allArticulos');
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
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
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <Box display="flex" justifyContent="center" width="100%">
                    <ProductCard product={product} addToCart={addToCart} />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Anterior
              </Button>
              <Typography variant="body1" style={{ margin: '0 20px', alignSelf: 'center' }}>
                Página {page + 1} de {totalPages}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
              >
                Siguiente
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ProductosPage;
