import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../../../context';
import Loader from "../../../../Loaders/Loader";


function MakeDeliver({ closeModal,dataClient,saldo_restante }) {
  const {insertDebtTables,isInserting} = useAppContext();
  const date = new Date().toISOString().split("T")[0]
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

  useEffect(()=>{
    let client = dataClient[0]
    setHookDeliverData({
        nombre_cliente: client.nombre_completo,
        apellido: client.apellido,
        uuid_cliente: client.uuid,
        monto_entrega: value,
        fecha_entrega: date
      })
},[dataClient, value])

 
  const handleInput = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const validateForm = (ev) => {
    ev.preventDefault();
    if (!value) {
      message.error("Hay campos vacíos, complételos");
      return;
    }else if(value > saldo_restante){
      message.error("No puede hacer una entrega mayor al saldo total")
    } else {
        insertDebtTables(hookDeliverData)
    }
  };

  return (
    <Modal
      title=<h1>Hacer una entrega</h1>
      visible={true}
      onOk={handleOk}
      closeIcon={false}
      width={1000}
      footer={[
        <Button type="primary" danger onClick={handleOk} className='btn_closeModalEditProduct'>
          Cerrar
        </Button>,
      ]}
    >
      <div className='EditProduct__wrapper'>
        <form className='form-addProduct' onSubmit={validateForm}>
          <label className='form-addProduct-label'>
            Saldo restante: ${saldo_restante}
          </label>
          <label className='form-addProduct-label'>
            Cantidad a entregar:
            <input
              type="number"
              value={value}
              onChange={handleInput}
              className='form-addProduct-input'
            />
          </label>
          <button className='form-addProduct-btn' type='submit'>{isInserting ? <Loader/> : "Actualizar"}</button>
        </form>
      </div>
    </Modal>
  );
}

export default MakeDeliver;
