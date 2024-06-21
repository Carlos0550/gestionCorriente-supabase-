import React, { useState } from 'react'
import { Button, Modal, message } from 'antd';
import "./editProducts.css"
import { useAppContext } from '../../../../context';
import Loader from '../../../../Loaders/Loader';
function EditProducts({ closeModal, dataProduct }) {
  const {updateProduct,isUpdatingProduct} = useAppContext()
  const handleOk = () => {
    closeModal();
  };

  const [hookProduct, setHookProduct] = useState({
    id: dataProduct.id,
    change: dataProduct.change,
    nameProduct: dataProduct.nameProduct,
    price: dataProduct.price,
    quantity: dataProduct.quantity,
  })

  const handleInputChange = (e)=>{
    const {value,name} = e.target;
    setHookProduct((prevState)=>({
      ...prevState,
      [name]:value
    }))
  }
  const validateForm = (ev) =>{
    ev.preventDefault()
    if (!hookProduct.nameProduct || !hookProduct.price || !hookProduct.change || !hookProduct.quantity) {
      message.error("Hay campos vacios, complételos")
      return
    }else{
      updateProduct(hookProduct)
    }
  }
  return (
    <>
      <Modal
        title=""
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
          <form className='form-addProduct' >
            <label className='form-addProduct-label'>Nombre producto:
              <input type="text" name='nameProduct' value={hookProduct.nameProduct} onChange={handleInputChange} className='form-addProduct-input' />
            </label>

            <label className='form-addProduct-label'>Precio Unitario:
              <input type="text" name='price' value={hookProduct.price} onChange={handleInputChange} className='form-addProduct-input' />
            </label>

            <label className='form-addProduct-label'>Moneda:
              <select name="change" value={hookProduct.change} onChange={handleInputChange} className='selector'>
                <option value="">Seleccione la moneda</option>
                <option value="ars">Pesos</option>
                <option value="usd">Usd</option>
              </select>
            </label>

            <label className='form-addProduct-label'>Cantidad:
              <input type="text" name='quantity' value={hookProduct.quantity} onChange={handleInputChange} className='form-addProduct-input' />
            </label>
          </form>
          <button className='form-addProduct-btn' type='submit' onClick={validateForm}>{isUpdatingProduct ? <Loader/> : "Actualizar"}</button>
        </div>
      </Modal>
    </>
  )
}

export default EditProducts