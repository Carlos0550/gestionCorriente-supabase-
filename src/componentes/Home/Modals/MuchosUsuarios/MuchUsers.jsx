import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../../context';
import "./muchUsers.css"
const MuchUsers = ({ closeModal }) => {
    const { clientData, setClientData } = useAppContext()
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        setConfirmLoading(true);
        setClientData([])
        setTimeout(() => {
            setConfirmLoading(false);
            closeModal();
        }, 1000);
    };

    const selectedOption = (index) => {
        setClientData([clientData[index]])
        closeModal()
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
                    <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading} className='button is-danger is-size-6'>
                        Cancelar
                    </Button>
                ]}
            >
                {clientData && (
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr className='is-background-white '>
                            <th className='is-color-black is-size-5'>Nombre</th>
                            <th className='is-color-black is-size-5'>Apodo</th>
                            <th className='is-color-black is-size-5'>DNI</th>
                            <th className='is-color-black is-size-5'>Acción</th>
                        </tr>
                    </thead>
                    <tbody >
                        {clientData.map((item, index) => (
                            <tr key={index} className='is-background-white'>
                                <td style={{ textTransform: "capitalize" }} className='is-color-black is-background-white has-text-weight-bold is-size-5'>{item.nombre_completo}</td>
                                <td className='is-color-black is-background-white is-size-5'>{item.apodo || "No hay apodo"}</td>
                                <td className='is-color-black is-background-white is-size-5'>{item.dni || "No tiene DNI"}</td>
                                <td>
                                    <div className="control">
                                        <button className='button is-info' onClick={() => selectedOption(index)}>Seleccionar este cliente</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            </Modal>
        </>
    );
};

export default MuchUsers;
