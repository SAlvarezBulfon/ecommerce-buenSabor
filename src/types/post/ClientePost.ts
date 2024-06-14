import DomicilioPost from "./DomicilioPost";


export default interface ClientePost{
    id?:number;
    nombre:string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento: string;
    domicilios: DomicilioPost[];
    imagenUrl: string;
}