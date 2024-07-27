import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../../context';
import NotificationError from "../../Notifications/NotificationError";
import "./editClient.css";

const EditDataClient = ({ closeModal }) => {
    const { clientData, updateDataClient, isUpdating } = useAppContext();
    const navigate = useAppContext();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [hookCLientData, setHookClientData] = useState({
        nombre_completo: "",
        apodo: "",
        telefono: "",
        dni: "",
        direccion: "",
        uuid: ""
    });
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (clientData && clientData.length > 0) {
            const firstClient = clientData[0];
            setHookClientData({
                nombre_completo: firstClient.nombre_completo || "",
                telefono: firstClient.telefono || "",
                dni: firstClient.dni || "",
                apodo: firstClient.apodo || "",
                direccion: firstClient.direccion || "",
                uuid: firstClient.uuid
            });
        }
    }, [clientData]);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setConfirmLoading(false);
            closeModal();
        }, 0);
    };

    const handleInputChange = (e) => {
        const { value, name } = e.target;
        setHookClientData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = async (ev) => {
        ev.preventDefault();

        // Formatea el número de teléfono
        const formattedPhoneNumber = hookCLientData.telefono ? `+549${hookCLientData.telefono.replace(/\D/g, '')}` : '';

        // Actualiza el estado con el número de teléfono formateado
        const updatedData = {
            ...hookCLientData,
            telefono: formattedPhoneNumber
        };

        // Validaciones adicionales
        if (!updatedData.nombre_completo) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 2500);
        } else {
            setShowAlert(false);
            await updateDataClient(updatedData);
            closeModal();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            closeModal();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate]);

    return (
        <>
            <Modal
                title=""
                visible={true}
                onOk={handleOk}
                okText="Cancelar"
                width={1000}
                confirmLoading={confirmLoading}
                footer={[
                    // Aquí puedes definir los botones de pie de página si es necesario
                ]}
                closeIcon={false}
            >
                <div className="container">
                    <form className='box is-background-black' onSubmit={validateForm}>
                        <label className='label is-color-black'>
                            <div className='is-background-white'>
                                <p className='is-color-black is-size-5'>Nombre Completo:</p>
                                <span className='tag is-danger mb-3 mt-1'>*Obligatorio*</span>
                                <input type="text" 
                                    name='nombre_completo'
                                    value={hookCLientData.nombre_completo}
                                    className='input is-color-black is-background-white'
                                    onChange={handleInputChange} />
                            </div>
                        </label>

                        <label className='label is-color-black'>
                            <div className='is-background-white'>
                                <p className='is-color-black is-size-5'>Apodo:</p>
                                <span className='tag is-info mb-3 mt-1'>*Opcional*</span>
                                <input type="text" 
                                    name='apodo'
                                    value={hookCLientData.apodo}
                                    className='input is-color-black is-background-white'
                                    onChange={handleInputChange} />
                            </div>
                        </label>

                        <label className='label'>
                            <div className="is-background-white">
                                <p className='is-color-black is-size-5'>Dni:</p>
                                <span className='tag is-info mb-3 mt-1'>*Opcional*</span>
                                <input type="text" 
                                    name='dni' 
                                    value={hookCLientData.dni} 
                                    className='input is-color-black is-background-white'
                                    onChange={handleInputChange} />
                            </div>
                        </label>

                        <label className='label'>
                            <div className='is-background-white'>
                                <p className='is-color-black is-size-5'>Teléfono:</p>
                                <span className='tag is-info mb-3 mt-1'>*Opcional*</span>
                                <input type="text" 
                                    name='telefono' 
                                    value={hookCLientData.telefono} 
                                    className='input is-color-black is-background-white'
                                    onChange={handleInputChange} />
                            </div>
                        </label>

                        <label className='label'>
                            <div className="is-background-white">
                                <p className='is-color-black is-size-5'>Dirección:</p>
                                <span className='tag is-info mb-3 mt-1'>*Opcional*</span>
                                <input type="text" 
                                    name='direccion' 
                                    value={hookCLientData.direccion} 
                                    className='input is-color-black is-background-white'
                                    onChange={handleInputChange} />
                            </div>
                        </label>
                        
                        {showAlert && <NotificationError showAlert={showAlert} />}
                        
                        <button className='button is-warning is-size-5 m-2' type='submit' disabled={isUpdating} style={{ cursor: isUpdating ? "not-allowed" : "pointer" }}>
                            {isUpdating ? "Aguarde..." : "Actualizar"}
                        </button>
                        <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading} className='button is-danger is-size-5 m-2'>
                            Cerrar sección
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default EditDataClient;
