import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import { message } from 'antd';
import "./productModal.css"
import BackTop from 'antd/es/float-button/BackTop';
const ProductModal = ({ closeModal }) => {
  const { clientData, addDebt, addingDebt, debtError, debtSuccess } = useAppContext()
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
        <div className='container p-3'>
          <div className="columns">
            <div className="column custom-column-addProduct">
              <form className='form__addProduct' onSubmit={validateForm}>
                <h1 className='title is-color-white'>Agregar un producto</h1>

                <div className="field">
                  <label className='label is-color-black'>Nombre producto:
                    <input type="text" name='nameProduct' value={values.nameProduct} onChange={handleInputChange} className='input' />
                  </label>

                  <label className='label is-color-black'>Precio Unitario:
                    <input type="text" name='price' value={values.price} onChange={handleInputChange} className='input' />
                  </label>

                  <label className='label is-color-black'>Moneda:
                   <div className="select is-rounded ml-2">
                   <select name="change" onChange={handleInputChange} className='select'>
                      <option value=""><p>Por defecto pesos</p></option>
                      <option value="ars">Pesos</option>
                      <option value="usd">Usd</option>
                    </select>
                   </div>
                  </label>

                  <label className='label is-color-black'>Cantidad:
                    <input type="text" name='quantity' value={values.quantity} onChange={handleInputChange} className='input' />
                  </label>
                </div>
              </form>
              <button className='button is-warning m-3' type='submit' disabled={addingDebt} style={{ cursor: addingDebt ? "not-allowed" : "" }} onClick={validateForm}>{addingDebt ? "Aguarde..." : "Añadir al fichero"}</button>
            </div>

          </div>

        </div>

      </Modal>
    </>
  );
};

export default ProductModal;
