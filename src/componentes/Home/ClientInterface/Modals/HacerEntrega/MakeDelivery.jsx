import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../../../context';
import Loader from "../../../../Loaders/Loader";

function MakeDeliver({ closeModal, dataClient, saldo_restante }) {
  const { insertDebtTables, isInserting, fullDate } = useAppContext();

  let client = dataClient[0];
  const [values, setValues] = useState({
    monto_entrega: "",
    fecha_entrega: fullDate,
    nombre_cliente: client.nombre_completo,
    uuid_cliente: client.uuid,
  });

  const handleOk = () => {
    closeModal();
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = async (ev) => {
    ev.preventDefault();
    const { monto_entrega, fecha_entrega } = values;

    if (!monto_entrega || monto_entrega < 0) {
      message.error("Hay campos vacíos, complételos");
      return;
    } else if (parseFloat(monto_entrega) > saldo_restante) {
      message.error("No puede hacer una entrega mayor al saldo total");
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
      footer={[]}
    >
      <div className='container'>
        <div className="column">
          <div className="columns">
            <form className='box is-background-black' onSubmit={validateForm}>
              <label className='label box is-background-white'>
                <p className='title is-size-4 has-text-weight-bold has-text-black'>Saldo restante: ${saldo_restante}</p>
              </label>
              <label className='label title is-size-4 has-text-weight-bold has-text-black'>
                Cantidad a entregar:
                <input
                  type="text"
                  name="monto_entrega"
                  value={values.monto_entrega}
                  onChange={handleInput}
                  className='input mt-1 is-color-black is-size-5'
                  style={{ backgroundColor: "#ccc" }}
                />
              </label>
              <label className='label is-color-black'>Fecha de entrega (opcional):
                <input
                  type="text"
                  name='fecha_entrega'
                  value={values.fecha_entrega}
                  onChange={handleInput}
                  className='input is-color-black'
                  style={{ backgroundColor: "#ccc" }}
                />
              </label>
              <button className='button is-info is-size-5 has-text-weight-bold m-3' type='submit'>
                {isInserting ? <Loader /> : "Entregar"}
              </button>
              <Button type="primary" danger onClick={handleOk} className='button is-danger is-size-5 m-3 has-text-weight-bold'>
                Cancelar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MakeDeliver;
