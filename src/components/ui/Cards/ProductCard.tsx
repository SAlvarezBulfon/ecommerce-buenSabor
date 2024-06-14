import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Button, CircularProgress } from '@mui/material';
import IProducto from '../../../types/IProducto';

interface ProductCardProps {
  product: IProducto;
  addToCart: (productId: number, products: IProducto[]) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      addToCart(product.id, [product]);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ width: '100%' }}>
      <CardActionArea>
        {product.imagenes.length > 0 && (
          <CardMedia
            component="img"
            height="140"
            image={String(product.imagenes[0])}
            alt={product.denominacion}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.denominacion}
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
