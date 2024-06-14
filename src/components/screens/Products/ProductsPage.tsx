import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, Container, Grid, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import IProducto from '../../../types/IProducto';
import ICategoria from '../../../types/ICategoria';
import ProductCard from '../../ui/Cards/ProductCard';
import ProductoService from '../../../services/ProductoService';
import CategoriaService from '../../../services/CategoriaService';

const productoService = new ProductoService();
const categoriaService = new CategoriaService();

interface ProductosPageProps {
  addToCart: (productId: number, products: IProducto[]) => void;
}

const ProductosPage: React.FC<ProductosPageProps> = ({ addToCart }) => {
  const [products, setProducts] = useState<IProducto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ICategoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const pageSize = 10;
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriaService.getAll(url + '/categoria/getCategoriasArticulos');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (selectedCategory !== null) {
          const data = await productoService.getPaginatedProductsByCategory(page, pageSize, selectedCategory, url);
          console.log(data.content)
          setProducts(data.content);
          setTotalPages(data.totalPages);
        } else {
          const data = await productoService.getPaginatedProducts(page, pageSize, url + '/eCommerce/allArticulos');
          setProducts(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value as number | string;
    if (value === "") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(value as number);
    }
    setPage(0);
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
        <Box display="flex" width="100%" mb={2}>
          <TextField
            fullWidth
            label="Buscar productos"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: 20 }}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="category-select-label">Categoría</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory ?? ''}
              onChange={handleCategoryChange}
              label="Categoría"
            >
              <MenuItem value="">
                <em>Todos</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.denominacion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
