import DataModel from "./DataModel";
import { Estado } from "./enums/Estado";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";
import ISucursal from "./ISucursal";

export default interface IPedido extends DataModel<IPedido>{
    horaEstimadaFinalizacion: number,
    total: number,
    totalCosto: number,
    estado: Estado,
    tipoEnvio: TipoEnvio,
    formaPago: FormaPago,
    fechaPedido: string,
    sucursal: ISucursal
}