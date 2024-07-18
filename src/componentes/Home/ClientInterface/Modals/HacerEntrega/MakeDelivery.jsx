import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../../../context';
import Loader from "../../../../Loaders/Loader";

function MakeDeliver({ closeModal, dataClient, saldo_restante, edit_entrega_data }) {
  const { 
    insertDebtTables, 
    isInserting, 
    fullDate,
    setIsUpdatingDeliver, 
    isUpdatingDeliver,
    updateDeliver,
    isSendingUpdatingDeliver
  } = useAppContext();
  const { editing, tope_maximo } = edit_entrega_data;
  let client = dataClient[0];
  const [values, setValues] = useState({
    idDebt: edit_entrega_data.idDebt || "",
    monto_entrega: "",
    fecha_entrega: edit_entrega_data.fecha_entrega || fullDate,
    nombre_cliente: edit_entrega_data.nombre_cliente || client.nombre_completo,
    uuid_cliente: client.uuid,
  });

  const handleOk = () => {
    closeModal();
    setIsUpdatingDeliver(!isUpdatingDeliver);
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
    } else if (isUpdatingDeliver) {
      if (!monto_entrega || monto_entrega < 0) {
        message.error("Hay campos vacíos, complételos");
      } else {
        await updateDeliver(values);
        closeModal();
      }
    } else if (parseFloat(monto_entrega) > saldo_restante) {
      message.error(`No puede hacer una entrega mayor a ${saldo_restante}`);
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
          <form className='box is-background-black' onSubmit={validateForm}>
            <table className="table is-fullwidth is-striped is-hoverable">
              <tbody>
                {isUpdatingDeliver === true ? null : (
                  <tr>
                    <td>
                      <label className='label is-size-4 has-text-weight-bold has-text-black is-background-white'>
                        Saldo restante:
                      </label>
                    </td>
                    <td>
                      <p className='title is-size-4 has-text-weight-bold has-text-white'>
                        ${saldo_restante}
                      </p>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <label className='label is-size-4 has-text-weight-bold has-text-black is-background-white'>
                      Cantidad a entregar:
                    </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="monto_entrega"
                      value={values.monto_entrega}
                      onChange={handleInput}
                      className='input mt-1 is-color-black is-size-5'
                      style={{ backgroundColor: "#ccc" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label className='label is-color-black is-size-5'>
                      Fecha de entrega (opcional):
                    </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name='fecha_entrega'
                      value={values.fecha_entrega}
                      onChange={handleInput}
                      className='input is-color-black is-size-5'
                      style={{ backgroundColor: "#ccc" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button className='button is-info is-size-5 has-text-weight-bold m-3' type='submit'>
                      {isUpdatingDeliver ? null : isInserting ? <Loader /> : "Entregar"}
                      {isUpdatingDeliver ? isSendingUpdatingDeliver ? <Loader /> : "Actualizar" : null}
                    </button>
                    <Button 
                      type="primary" 
                      danger 
                      onClick={handleOk} 
                      className='button is-danger is-size-5 m-3 has-text-weight-bold'
                    >
                      Cancelar
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default MakeDeliver;
