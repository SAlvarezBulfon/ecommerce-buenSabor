import IDetallePedido from "./IDetallePedido";
import IDomicilio from "./IDomicilio";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";

export default interface IPedido {
  id?: number; 
  tipoEnvio: TipoEnvio;
  formaPago: FormaPago;
  fechaPedido?: string; 
  detallePedidos: IDetallePedido[];
  idCliente: number;
  domicilio: IDomicilio; 
}