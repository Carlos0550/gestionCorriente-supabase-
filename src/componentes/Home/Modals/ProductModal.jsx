import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import { message } from 'antd';
import "./productModal.css"
import BackTop from 'antd/es/float-button/BackTop';
const ProductModal = ({ closeModal }) => {
  const { clientData, addDebt, addingDebt, debtError, debtSuccess} = useAppContext()
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      closeModal();
    }, 500);
  };


  //  Formulario
  const fechaActual = new Date();
  const firstClient = clientData[0]
  const [values, setValues] = useState({
    nameProduct: "",
    quantity: "",
    price: "",
    change: "ars",
    buyDate: fechaActual.toISOString().split("T")[0],
    nombre_cliente: firstClient.nombre_completo,
    apellido_cliente: firstClient.apellido,
    uuid: firstClient.uuid
  })
  const handleInputChange = (e) => {
    const { value, name } = e.target
    setValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const validateForm = (ev) => {
    ev.preventDefault()
    if (!values.nameProduct || !values.change || !values.price || !values.quantity) {
      message.error("Todos los campos son requeridos")
    } else {
      message.success("Producto añadido!")
      addDebt(values)
    }
  }
  // useEffect(() => {
  //   console.log("Values: ", values)
  // }, [values])
  return (
    <>
      <Modal
        title=""
        visible={true}
        onOk={handleOk}
        okText="Cancelar"
        confirmLoading={confirmLoading}
        closeIcon={false}
        width={1000}
        footer={[
          <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading}>
            Cerrar
          </Button>,
        ]}
      >
        <div className='addProduct__wrapper'>
          <form className='form-addProduct' onSubmit={validateForm}>
            <label className='form-addProduct-label'>Nombre producto:
              <input type="text" name='nameProduct' value={values.nameProduct} onChange={handleInputChange} className='form-addProduct-input' />
            </label>

            <label className='form-addProduct-label'>Precio Unitario:
              <input type="text" name='price' value={values.price} onChange={handleInputChange} className='form-addProduct-input' />
            </label>

            <label className='form-addProduct-label'>Moneda:
              <select name="change" onChange={handleInputChange} className='selector'>
                <option value="ars">Pesos</option>
                <option value="usd">Usd</option>
              </select>
            </label>

            <label className='form-addProduct-label'>Cantidad:
              <input type="text" name='quantity' value={values.quantity} onChange={handleInputChange} className='form-addProduct-input' />
            </label>
          </form>
          <button className='form-addProduct-btn' type='submit' disabled={addingDebt} style={{cursor: addingDebt ? "not-allowed" : ""}} onClick={validateForm}>{addingDebt ? "Aguarde...": "Añadir al fichero"}</button>
        </div>

      </Modal>
    </>
  );
};

export default ProductModal;
