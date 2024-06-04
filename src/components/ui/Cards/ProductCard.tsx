import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Button, CircularProgress } from '@mui/material';
import IProducto from '../../../types/IProducto';

interface ProductCardProps {
  product: IProducto;
  addToCart: (productId: number, products: IProducto[]) => void; // Corregir el tipo de addToCart
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      // Solo necesitamos enviar el ID del producto al carrito
      addToCart(product.id, [product]); // Corregir para que pase un array de productos como se espera
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={product.imagenes[0].url}
          alt={product.descripcion}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.descripcion}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Precio: ${product.precioVenta}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Button
        onClick={handleAddToCart}
        fullWidth
        variant="contained"
        color="primary"
        disabled={isLoading}
        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {isLoading ? 'Agregando...' : 'Agregar al carrito'}
      </Button>
    </Card>
  );
};

export default ProductCard;
