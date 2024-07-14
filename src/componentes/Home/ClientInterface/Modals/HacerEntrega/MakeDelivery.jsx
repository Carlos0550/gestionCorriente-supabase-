import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../../../context';
import Loader from "../../../../Loaders/Loader";


function MakeDeliver({ closeModal, dataClient, saldo_restante }) {
  const { insertDebtTables, isInserting } = useAppContext();
  const date = new Date();

  let año = date.getFullYear()
  let mes = date.getMonth() + 1 
  let dia = date.getDate()

  const fullDate = `${dia}-${mes}-${año}`
  const [value, setValue] = useState(''); // Estado para almacenar el valor del input

  const handleOk = () => {
    closeModal();
  };
  const [hookDeliverData, setHookDeliverData] = useState({
    nombre_cliente: "",
    apellido: "",
    uuid_cliente: "",
    monto_entrega: "",
    fecha_entrega: ""
  })

  useEffect(() => {
    let client = dataClient[0]
    setHookDeliverData({
      nombre_cliente: client.nombre_completo,
      apellido: client.apellido,
      uuid_cliente: client.uuid,
      monto_entrega: value,
      fecha_entrega: fullDate
    })
  }, [dataClient, value])


  const handleInput = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const validateForm = async(ev) => {
    ev.preventDefault();
    if (!value || value < 0) {
      message.error("Hay campos vacíos, complételos");
      return;
    } else if (value > saldo_restante) {
      message.error("No puede hacer una entrega mayor al saldo total")
    } else {
      await insertDebtTables(hookDeliverData)
      closeModal()
    }
  };

  return (
    <Modal

      visible={true}
      onOk={handleOk}
      closeIcon={false}
      
      footer={[
        <Button type="primary" danger onClick={handleOk} className='btn_closeModalEditProduct'>
          Cerrar
        </Button>,
      ]}
    >
      <div className='container'>
        <div className="column">
          <div className="columns">
            <form className='box' onSubmit={validateForm}>
              <label className='label box'>
                <p className='subtitle has-text-weight-bold has-text-warning'>Saldo restante: ${saldo_restante}</p>
              </label>
              <label className='label box'>
                Cantidad a entregar:
                <input
                  type="number"
                  value={value}
                  onChange={handleInput}
                  className='input mt-1'
                />
              </label>
              <button className='button is-warning' type='submit'>{isInserting ? <Loader /> : "Actualizar"}</button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default MakeDeliver;
