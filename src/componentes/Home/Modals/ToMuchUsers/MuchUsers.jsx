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
        console.log("User data: ", [clientData[index]])
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
                <h1 className='muchUsers__h1'>Se encontró más de un cliente con el mismo nombre, deberá elegir uno:</h1>
                {clientData && clientData.map((item, index) => {
                    return (
                        <div key={index} className='muchUsers__container'>
                            <label className='muchUsers__label'>
                                <p>Nombre: {item.nombre_completo}</p>
                                <p>Apellido: {item.apellido}</p>
                                <p>Dni: {item.dni}</p>
                                <p>Dirección: {item.direccion}</p>
                                <p>Teléfono: {item.telefono}</p>
                            </label>
                            <button className='muchUsers__btn' onClick={() => selectedOption(index)}>Seleccionar este cliente</button>

                        </div>
                    )
                })}
            </Modal>
        </>
    );
};

export default MuchUsers;
