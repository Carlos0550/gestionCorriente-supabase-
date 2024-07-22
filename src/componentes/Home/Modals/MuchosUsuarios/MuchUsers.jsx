import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../../context';
import "./muchUsers.css"
const MuchUsers = ({ closeModal }) => {
    const { clientData, setClientData } = useAppContext()
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setConfirmLoading(false);
            closeModal();
        }, 1000);
    };

    const selectedOption = (index) => {
        setClientData([clientData[index]]) //mantenemos como array a clientData
        handleOk()
    }

    return (
        <>
            <Modal
                title=""
                visible={true}
                onOk={handleOk}
                okText="Cancelar"
                width={1000}
                closeIcon={false}
                confirmLoading={confirmLoading}
                footer={[
                    <Button key="update" type="primary" onClick={handleOk} disabled={true} style={{ cursor: "not-allowed" }} loading={confirmLoading}>
                        Cerrar
                    </Button>,
                ]}
            >
                <h1 className='title is-color-black'>Se encontró más de 1 cliente con el mismo parámetro de busqueda: </h1>


                <div className='container custom__container-muchUsers'>
                    <div className="columns" >
                        {clientData && clientData.map((item, index) => {
                            return (
                                <div className="column" key={index}>
                                    <label className='label'>
                                        <div className="box is-background-black"><p className='subtitle has-text-weight-bold  is-color-white'>#{index + 1} Coincidencia</p></div>
                                        <div className="field">
                                            <div className="box"><p>Nombre: {item.nombre_completo}</p></div>
                                            <div className="box"><p>Apodo: {item.apodo}</p></div>
                                            <div className="box"><p>Dni: {item.dni}</p></div>
                                            <div className="box"><p>Dirección: {item.direccion}</p></div>
                                            <div className="box"><p>Teléfono: {item.telefono}</p></div>
                                        </div>
                                    </label>
                                    <div className="control">
                                        <button className='button is-info m-5' onClick={() => selectedOption(index)}>Seleccionar este cliente</button>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>


            </Modal>
        </>
    );
};

export default MuchUsers;
