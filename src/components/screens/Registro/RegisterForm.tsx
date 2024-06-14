import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button, TextField, Typography, FormControl,
    Input, FormHelperText, InputLabel, Box, Container,
    Select, MenuItem
} from '@mui/material';
import ClienteService from '../../../services/ClienteService';
import { useAuth0 } from '@auth0/auth0-react';
import ClientePost from '../../../types/post/ClientePost';
import PaisService from '../../../services/PaisService';
import ProvinciaService from '../../../services/ProvinciaService';
import LocalidadService from '../../../services/LocalidadService';
import ILocalidad from '../../../types/ILocalidad';
import IProvincia from '../../../types/IProvincia';
import IPais from '../../../types/IPais';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();
    const clienteService = new ClienteService();
    const paisService = new PaisService();
    const provinciaService = new ProvinciaService();
    const localidadService = new LocalidadService();
    const URL: string = import.meta.env.VITE_API_URL as string;
    const navigate = useNavigate();

    const [paises, setPaises] = useState<IPais[]>([]);
    const [provincias, setProvincias] = useState<IProvincia[]>([]);
    const [localidades, setLocalidades] = useState<ILocalidad[]>([]);
    const [selectedPais, setSelectedPais] = useState<any>('');
    const [selectedProvincia, setSelectedProvincia] = useState<any>('');
    const [selectedLocalidad, setSelectedLocalidad] = useState<any>('');
    const [needsName, setNeedsName] = useState<boolean>(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            setNeedsName(!user.given_name || !user.family_name);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const paises = await paisService.getAll(`${URL}/pais`);
                setPaises(paises);
            } catch (error) {
                console.error('Error al obtener los países:', error);
            }
        };

        fetchPaises();
    }, [URL]);

    useEffect(() => {
        const fetchProvincias = async () => {
            try {
                if (selectedPais) {
                    const provincias = await provinciaService.getAll(`${URL}/provincia/findByPais/${selectedPais}`);
                    setProvincias(provincias);
                }
            } catch (error) {
                console.error('Error al obtener las provincias:', error);
            }
        };

        fetchProvincias();
    }, [URL, selectedPais]);

    useEffect(() => {
        const fetchLocalidades = async () => {
            try {
                if (selectedProvincia) {
                    const localidades = await localidadService.getAll(`${URL}/localidad/findByProvincia/${selectedProvincia}`);
                    setLocalidades(localidades);
                }
            } catch (error) {
                console.error('Error al obtener las localidades:', error);
            }
        };

        fetchLocalidades();
    }, [URL, selectedProvincia]);

    const handlePaisChange = (event: any) => {
        const paisId = event.target.value;
        setSelectedPais(paisId);
        setSelectedProvincia('');
        setSelectedLocalidad('');
    };

    const handleProvinciaChange = (event: any) => {
        const provinciaId = event.target.value;
        setSelectedProvincia(provinciaId);
        setSelectedLocalidad('');
    };

    const handleLocalidadChange = (event: any) => {
        const localidadId = event.target.value;
        setSelectedLocalidad(localidadId);
    };

    const formik = useFormik({
        initialValues: {
            nombre: user?.given_name || '',
            apellido: user?.family_name || '',
            telefono: '',
            fechaNacimiento: '',
            calle: '',
            numero: 0,
            cp: 0,
            piso: 0,
            nroDpto: 0,
            needsName: needsName
        },
        validationSchema: Yup.object({
            nombre: Yup.string().when('needsName', (needsName, schema) => {
                return needsName ? schema.required('Requerido') : schema;
            }),
            apellido: Yup.string().when('needsName', (needsName, schema) => {
                return needsName ? schema.required('Requerido') : schema;
            }),
            telefono: Yup.string().required('Requerido'),
            fechaNacimiento: Yup.date()
                .required('Requerido')
                .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro'),
            calle: Yup.string().required('Campo requerido'),
            numero: Yup.number().required('Campo requerido'),
            cp: Yup.number().required('Campo requerido'),
            piso: Yup.number().nullable(),
            nroDpto: Yup.number().nullable()
        }),        
        onSubmit: async (values) => {
            if (!isAuthenticated || !user) {
                alert('Usuario no autenticado');
                return;
            }

            const clientePost: ClientePost = {
                nombre: values.nombre || user.given_name || '',
                apellido: values.apellido || user.family_name || '',
                telefono: values.telefono,
                email: user.email || '',
                fechaNacimiento: values.fechaNacimiento,
                domicilios: [{
                    calle: values.calle,
                    numero: values.numero,
                    cp: values.cp,
                    piso: values.piso,
                    nroDpto: values.nroDpto,
                    idLocalidad: selectedLocalidad
                }],
                imagenUrl: user.picture || ''
            };

            try {
                await clienteService.post(URL + '/clientes', clientePost);
                alert('Cliente registrado exitosamente');
                navigate(0);
            } catch (error) {
                console.error('Error al registrar cliente:', error);
                alert('Error al registrar cliente');
            }
        },
    });
    
        return (
            <Container sx={{ mt: 2 }} maxWidth='sm'>
                <form onSubmit={formik.handleSubmit}>
                    <Typography variant="h6">Registrar</Typography>
                    {needsName && (
                        <>
                            <TextField
                                fullWidth
                                id="nombre"
                                name="nombre"
                                label="Nombre"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                helperText={formik.touched.nombre && formik.errors.nombre}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                id="apellido"
                                name="apellido"
                                label="Apellido"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                error={formik.touched.apellido && Boolean(formik.errors.apellido)}
                                helperText={formik.touched.apellido && formik.errors.apellido}
                                sx={{ mb: 2 }}
                            />
                        </>
                    )}
                    <TextField
                        fullWidth
                        id="telefono"
                        name="telefono"
                        label="Teléfono"
                        value={formik.values.telefono}
                        onChange={formik.handleChange}
                        error={formik.touched.telefono && Boolean(formik.errors.telefono)}
                        helperText={formik.touched.telefono && formik.errors.telefono}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <InputLabel htmlFor="fechaNacimiento">Fecha de Nacimiento</InputLabel>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Input
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                type="date"
                                value={formik.values.fechaNacimiento}
                                onChange={formik.handleChange}
                                error={formik.touched.fechaNacimiento && Boolean(formik.errors.fechaNacimiento)}
                                sx={{ paddingTop: '1rem' }}
                            />
                            {formik.touched.fechaNacimiento && formik.errors.fechaNacimiento && (
                                <FormHelperText error>{formik.errors.fechaNacimiento}</FormHelperText>
                            )}
                        </FormControl>
                    </Box>
    
                    <Typography variant="h6" sx={{ mt: 2 }}>Domicilio</Typography>
    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Calle"
                            id="calle"
                            name="calle"
                            value={formik.values.calle}
                            onChange={formik.handleChange}
                            error={formik.touched.calle && Boolean(formik.errors.calle)}
                            helperText={formik.touched.calle && formik.errors.calle}
                        />
                    </FormControl>
    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Número"
                            id="numero"
                            name="numero"
                            type="number"
                            value={formik.values.numero}
                            onChange={formik.handleChange}
                            error={formik.touched.numero && Boolean(formik.errors.numero)}
                            helperText={formik.touched.numero && formik.errors.numero}
                        />
                    </FormControl>
    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Código Postal"
                            id="cp"
                            name="cp"
                            type="number"
                            value={formik.values.cp}
                            onChange={formik.handleChange}
                            error={formik.touched.cp && Boolean(formik.errors.cp)}
                            helperText={formik.touched.cp && formik.errors.cp}
                        />
                    </FormControl>
    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Piso"
                            id="piso"
                            name="piso"
                            type="number"
                            value={formik.values.piso}
                            onChange={formik.handleChange}
                            error={formik.touched.piso && Boolean(formik.errors.piso)}
                            helperText={formik.touched.piso && formik.errors.piso}
                        />
                    </FormControl>
    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <TextField
                            label="Número de Departamento"
                            id="nroDpto"
                            name="nroDpto"
                            type="number"
                            value={formik.values.nroDpto}
                            onChange={formik.handleChange}
                            error={formik.touched.nroDpto && Boolean(formik.errors.nroDpto)}
                            helperText={formik.touched.nroDpto && formik.errors.nroDpto}
                        />
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="pais-label">País</InputLabel>
                        <Select
                            labelId="pais-label"
                            value={selectedPais || ''}
                            onChange={handlePaisChange}
                            label="País"
                        >
                            {paises.map((pais: IPais) => (
                                <MenuItem key={pais.id} value={pais.id}>
                                    {pais.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
    
                    {selectedPais && (
                        <>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="provincia-label">Provincia</InputLabel>
                                <Select
                                    labelId="provincia-label"
                                    value={selectedProvincia || ''}
                                    onChange={handleProvinciaChange}
                                    label="Provincia"
                                >
                                    {provincias.map((provincia: IProvincia) => (
                                        <MenuItem key={provincia.id} value={provincia.id}>
                                            {provincia.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                    {selectedProvincia && 
                    <>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="localidad-label">Localidad</InputLabel>
                                <Select
                                    labelId="localidad-label"
                                    value={selectedLocalidad || ''}
                                    onChange={handleLocalidadChange}
                                    label="Localidad"
                                >
                                    {localidades.map((localidad: ILocalidad) => (
                                        <MenuItem key={localidad.id} value={localidad.id}>
                                            {localidad.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                    </>}
    
                    <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                        Registrar
                    </Button>
                </form>
            </Container>
        );
    };
 

export default RegisterForm;
