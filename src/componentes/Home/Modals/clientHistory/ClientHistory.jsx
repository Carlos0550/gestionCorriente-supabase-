import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../../context';
import { useNavigate } from 'react-router-dom';

const ClientHistory = ({ closeModal }) => {
    const { fetchHistoryClient, clientHistory } = useAppContext();
    const navigate = useNavigate();
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setConfirmLoading(false);
            closeModal();
        }, 0);
    };

    useEffect(() => {
        fetchHistoryClient();
    }, [navigate]);

    const calcularMonto = (precio_producto, quantity, moneda) => {
        if (moneda === "ars") {
            return `$${precio_producto * quantity}`;
        } else if (moneda === "usd") {
            return `x${precio_producto}`;
        }
        return 0;
    };
    

    // Agrupación por fecha_compra
    const groupedHistory = clientHistory.reduce((acc, item) => {
        const date = item.fecha_compra; // Suponiendo que fecha_compra está en un formato adecuado
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

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
                    <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading}>
                        Cerrar
                    </Button>,
                ]}
                closeIcon={false}
            >
                <div className="control">
                    <div className="columns">
                        <div className="column">
                            <h1 className='title is-color-black'>Historial de {clientHistory.map(item => item.nombre_completo)[0]}</h1>
                            {Object.keys(groupedHistory).map((date, index) => (
                                <div key={index} className="table-container">
                                    <table className="table is-fullwidth is-bordered is-hoverable">
                                        <thead>
                                            
                                            <tr>
                                                <th className='has-text-weight-bold is-size-6'>Fecha de compra: {date}</th>
                                                <th>Producto/detalle</th>
                                                <th>Monto/código</th>
                                                <th>Fecha de cancelación</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                          
                                            {groupedHistory[date].map((item, idx) => (
                                                <tr key={idx}>
                                                  <td></td>
                                                    <td>{item.nombre_producto} | <p>cantidad: {item.quantity}</p> </td>
                                                    <td>{calcularMonto(item.precio_producto, item.quantity, item.moneda)}</td>
                                                    <td>{item.fecha_cancelacion}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ClientHistory;
