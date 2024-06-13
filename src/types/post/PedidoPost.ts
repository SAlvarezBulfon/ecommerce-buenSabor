import { FormaPago } from "../enums/FormaPago";
import { TipoEnvio } from "../enums/TipoEnvio";
import IDetallePedido from "../IDetallePedido";


export default interface PedidoPost {
    id?: number; 
    tipoEnvio: string;
    formaPago: string;
    fechaPedido?: string; 
    detallePedidos: IDetallePedido[];
    idCliente: number;
    idDomicilio: number; 
}