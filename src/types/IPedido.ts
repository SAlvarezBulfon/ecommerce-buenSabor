import IDetallePedido from "./IDetallePedido";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";

export default interface IPedido {
  id?: number; // Este campo es opcional ya que parece ser generado por el servidor
  total: number;
  totalCosto: number;
  tipoEnvio: TipoEnvio;
  formaPago: FormaPago;
  fechaPedido?: string; // Este campo es opcional si no lo necesitas especificar manualmente
  detallePedidos: IDetallePedido[];
  idCliente: number;
  idDomicilio: number; // El nombre de este campo debe coincidir con el JSON
}