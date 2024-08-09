import React, { useEffect, useState } from 'react';
import { Modal, message, Collapse, Flex, Progress, Skeleton } from 'antd';
import { Button, TextField } from '@mui/material';
import { supabase } from "../../Auth/supabase";
import { useAppContext } from '../context';
import axios from "axios";
const { Panel } = Collapse;

const SettingsModal = ({ closeModal }) => {
    const { setUsdPrice, usdPrice } = useAppContext();
    const [usdValue, setUsdValue] = useState("");
    const [dbSize, setDbSize] = useState(null);
    const [dbSizePercentage, setDbSizePercentage] = useState(null);
    const [fetchingSpace, setFetchingSpace] = useState(false);

    const handleInput = (e) => {
        setUsdValue(e.target.value);
    };

    const handleSaveConfig = async () => {
        if (!usdValue) {
            message.error("El valor del dólar no puede estar vacío");
            return;
        }

        try {
            const hideMessage = message.loading("Aguarde...", 0);

            const { data, error } = await supabase
                .from('usdPrice')
                .update({ value: usdValue })
                .eq('id', 1)
                .select();

            if (error) {
                message.error("Hubo un error, por favor intente nuevamente");
                hideMessage();
            } else {
                message.success("Dólar guardado");
                setUsdPrice([{ value: usdValue }]);
                closeModal();
                hideMessage();
            }
        } catch (error) {
            console.error("Error guardando el valor del dólar:", error);
            message.error("Hubo un error, por favor intente nuevamente");
        }
    };

    const fetchDatabaseSize = async () => {
        setFetchingSpace(true);
        try {
            // const response = await axios.post("https://gestion-corriente-server.vercel.app/check-space")
            const response = await axios.post("http://localhost:4000/check-space");
            if (response.status === 200) {
                setDbSize(response.data.space);
            } else {
                setDbSize("No se pudo obtener el tamaño de la base de datos");
            }
        } catch (error) {
            console.error("Error fetching database size:", error);
            setDbSize("No se pudo obtener el tamaño de la base de datos");
        } finally {
            setFetchingSpace(false);
        }
    };

    useEffect(() => {
        fetchDatabaseSize();
    }, []);

    useEffect(() => {
        if (dbSize && !isNaN(parseFloat(dbSize))) {
            const dbSizeInMB = Math.round(parseFloat(dbSize.replace("MB", "")));
            const percentageUsed = (dbSizeInMB / 500) * 100;
            setDbSizePercentage(percentageUsed);
        } else {
            setDbSizePercentage(null);
        }
    }, [dbSize]);

    return (
        <Modal
            title={<h1 className='title has-text-centered is-color-black m-1 p-1'>Ajustes</h1>}
            visible={true}
            onCancel={closeModal}
            footer={[
                <Button key="close" variant="contained" color="error" className='m-1' onClick={closeModal}>Cerrar</Button>,
            ]}
            width={450}
        >
            {fetchingSpace ? <Skeleton active /> : (
                <Collapse defaultActiveKey={['1']} accordion>
                    <Panel header="Configuración del Dólar" key="1">
                        <div className="container">
                            <div className="field">
                                <div className="label is-color-black">Valor actual: ${usdPrice.map(el => el.value)}</div>
                                <TextField
                                    id="outlined-basic"
                                    label="Ingresa el precio del dólar"
                                    variant="outlined"
                                    value={usdValue}
                                    onChange={handleInput}
                                    fullWidth
                                />
                                <Button key="save" variant="contained" className='m-1' onClick={handleSaveConfig}>Guardar</Button>
                            </div>
                        </div>
                    </Panel>
                    <Panel header="Espacio en la Base de Datos" key="2">
                        <div className="container">
                            <div className="field">
                                <div className="label is-color-black">
                                    Espacio usado:
                                    <Flex gap="small" wrap>
                                        <Progress
                                            type="circle"
                                            status={dbSizePercentage > 85 ? "exception" : "success"}
                                            percent={dbSizePercentage || 0}
                                            format={() => `${dbSizePercentage !== null ? `${Math.round(dbSizePercentage)}%` : "N/A"}`}
                                        />
                                    </Flex>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            )}
        </Modal>
    );
};

export default SettingsModal;
