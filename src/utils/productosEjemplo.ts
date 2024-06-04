import IProducto from "../types/IProducto";

// Ejemplo de datos para IProducto
const producto1: IProducto = {
    id: 1,
    denominacion: "Hamburguesa",
    descripcion: "Hamburguesa con queso",
    preparacion: "A la parrilla",
    tiempoEstimadoMinutos: 15,
    precioVenta: 4.99,
    unidadMedida: { id: 1, denominacion: "Unidad", eliminado: false },
    productoDetalle: [],
    imagenes: [{ id: 1, url: "https://images.unsplash.com/photo-1457460866886-40ef8d4b42a0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", eliminado: false }, { id: 2, url: "https://images.unsplash.com/photo-1608142014114-3099960b7e41?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", eliminado: false }],
    categoria: { id: 1,eliminado: false, denominacion: "Comida Rápida", subCategoriaS: [], esInsumo: false },
    eliminado: false
};

const producto2: IProducto = {
    id: 2,
    denominacion: "Pizza",
    descripcion: "Pizza con pepperoni y queso",
    preparacion: "Horneada",
    tiempoEstimadoMinutos: 20,
    precioVenta: 6.99,
    unidadMedida: { id: 1, denominacion: "Unidad", eliminado: false },
    productoDetalle: [],
    imagenes: [{ id: 3, url: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", eliminado: false }, { id: 4, url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", eliminado: false }],
    categoria: { id: 2,eliminado: false, denominacion: "Pizzas", subCategoriaS: [], esInsumo: false },
    eliminado: false
};

const producto3: IProducto = {
    id: 3,
    denominacion: "Ensalada",
    descripcion: "Ensalada fresca con vegetales",
    preparacion: "Mezclada",
    tiempoEstimadoMinutos: 10,
    precioVenta: 3.49,
    unidadMedida: { id: 1, denominacion: "Unidad", eliminado: false },
    productoDetalle: [],
    imagenes: [{ id: 5, url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", eliminado: false }, { id: 6, url: "https://plus.unsplash.com/premium_photo-1673590981774-d9f534e0c617?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", eliminado: false }],
    categoria: { id: 3, eliminado: false, denominacion: "Ensaladas", subCategoriaS: [], esInsumo: false },
    eliminado: false
};

// Exporta los productos de ejemplo
export const productosEjemplo: IProducto[] = [producto1, producto2, producto3];
