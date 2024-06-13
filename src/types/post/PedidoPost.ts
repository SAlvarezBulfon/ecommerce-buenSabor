import { FormaPago } from "../enums/FormaPago";
import { TipoEnvio } from "../enums/TipoEnvio";
import IDetallePedido from "../IDetallePedido";


export default interface PedidoPost {
    id?: number; 
    total: number;
    totalCosto: number;
    tipoEnvio: TipoEnvio;
    formaPago: FormaPago;
    fechaPedido?: string; 
    detallePedidos: IDetallePedido[];
    idCliente: number;
    idDomicilio: number; 
}