import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../../context';
import { useNavigate } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';

const ClientHistory = ({ closeModal }) => {
    const { fetchHistoryClient, clientHistory, fetchingHistory } = useAppContext();
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            closeModal();
        }
    };

    useEffect(() => {
        fetchHistoryClient();
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
                width={1800}
                confirmLoading={confirmLoading}
                
                footer={[
                    <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading} className='button is-danger is-size-5'>
                        Cerrar sección
                    </Button>
                ]}
                closeIcon={false}
            >
                <div className="control">
                    <div className="columns">
                        <div className="column">
                            {fetchingHistory ? <LinearProgress /> :
                                clientHistory.length > 0 ? 
                                <React.Fragment>
                                    <h1 className='title is-color-black' style={{textTransform: "capitalize"}}>Historial de {clientHistory.map(item => item.nombre_completo)[0]}</h1>
                                    <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading} className='button is-danger is-size-5'>
                                        Cerrar sección
                                    </Button>
                                    {Object.keys(groupedHistory)
                                        .reverse()
                                        .map((date, index) => (
                                            <div key={index} className="table-container">
                                                <table className="table is-fullwidth is-bordered is-hoverable">
                                                    <thead>

                                                        <tr>
                                                            <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold has-background-black'>Fecha de compra: {date}</th>
                                                            <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Producto/detalle</th>
                                                            <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Monto/código</th>
                                                            <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Fecha de cancelación</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {groupedHistory[date].map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className='is-background-white'></td>
                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>{item.nombre_producto.replace(/X|x/g, '')} | <p>cantidad: {item.quantity}</p> </td>
                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>{calcularMonto(item.precio_producto, item.quantity, item.moneda)}</td>
                                                                <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>{item.fecha_cancelacion}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                </React.Fragment>
                                : <div className="box">No hay datos</div>

                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ClientHistory;



