import IProducto from "./IProducto";


export default interface CartProduct extends IProducto {
  quantity: number;
}
