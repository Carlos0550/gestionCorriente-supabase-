import React, { useEffect, useState } from 'react';
import { Button, Modal, message, ConfigProvider,DatePicker } from 'antd';
import { Alert, TextField } from '@mui/material';
import { useAppContext } from '../../../context';
import Loader from "../../../Loaders/Loader";
import esES from 'antd/es/locale/es_ES';
import 'moment/locale/es';

function MakeDeliver({ closeModal, dataClient, saldo_restante }) {
  const {
    insertDebtTables,
    isInserting,
    fullDate,
  } = useAppContext();

  const client = dataClient[0];

  const [values, setValues] = useState({
    idDebt: "",
    monto_entrega: "",
    fecha_entrega: "",
    nombre_cliente: client.nombre_completo,
    uuid_cliente: client.uuid,
  });

  const handleOk = () => {
    closeModal();
  };

  const handleInput = (e) => {
    if (e && e.target) {
      const { value, name } = e.target;
      if (name === "monto_entrega") {
        const isValid = /^\d*\.?\d*$/.test(value);
        if (!isValid) return
      }
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else if (e && e.format) {
      setValues((prevState) => ({
        ...prevState,
        fecha_entrega: e.format('DD-MM-YYYY')
      }));
    }
  };



  const validateForm = async (ev) => {
    ev.preventDefault();
    const { monto_entrega } = values;

    if (!monto_entrega || monto_entrega < 0) {
      message.error("Hay campos vacíos, complételos");
      return;
    } else if (parseFloat(monto_entrega) > saldo_restante) {
      message.error(`No puede hacer una entrega mayor a ${saldo_restante}`);
      return;
    }else if(!values.fecha_entrega){
        message.error("Seleccione la fecha de entrega",3)
        return;
    } else {
      await insertDebtTables(values);
      closeModal();
    }
  };

  return (
    <Modal
      visible={true}
      onOk={handleOk}
      closeIcon={false}
      footer={null}
    >
      <div className='container'>
        <div className="column">
          <form className='box is-background-white' onSubmit={validateForm} style={{ borderRadius: "1rem" }}>
            <div className="flex-container">
              <Alert severity='info' style={{fontSize: "20px"}}>Saldo restante: ${saldo_restante}</Alert>
              {/* <TextField
                id="saldo_restante"
                label="Saldo restante"
                value={`$${saldo_restante}`}
                variant="outlined"
                fullWidth
                margin="normal"
              /> */}
            </div>

            <div className="flex-container">
              <TextField
                id="monto_entrega"
                label="Cantidad a Entregar"
                name="monto_entrega"
                value={values.monto_entrega}
                onChange={handleInput}
                variant="outlined"
                fullWidth
                margin="normal"
                inputProps={{inputMode: "decimal", pattern: '[0-9]*[.,]?[0-9]*' }}
              />
            </div>

            <div className="flex-container" style={{gap: "0"}}>
            <ConfigProvider locale={esES}>
                <DatePicker
                  name='fecha_entrega'
                  onChange={handleInput}
                  format={"DD-MM-YYYY"}
                />
              </ConfigProvider>

              <button
                className='button is-info is-size-6 has-text-weight-bold m-3'
                type='submit'
                disabled={isInserting}
                style={{ backgroundColor: isInserting ? "grey" : "", cursor: isInserting ? "not-allowed" : "" }}
              >
                {isInserting ? <Loader /> : "Entregar"}
              </button>
              <Button
                type="primary"
                danger
                onClick={handleOk}
                disabled={isInserting}
                style={{ backgroundColor: isInserting ? "grey" : "", cursor: isInserting ? "not-allowed" : "" }}
                className='button is-size-6 m-3 has-text-weight-bold'
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default MakeDeliver;
