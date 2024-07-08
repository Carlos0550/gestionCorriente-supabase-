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
    }else if(hookProduct.quantity < 1){
      message.error("La cantidad insertada no puede ser menor a 1")
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
            <h1 className='title'>Editando: {hookProduct.nameProduct}</h1>
            <label className='label box'>Nombre producto:
              <input type="text" name='nameProduct' value={hookProduct.nameProduct} onChange={handleInputChange} className='input' />
            </label>

            <label className='label box'>Precio Unitario:
              <input type="number" name='price' value={hookProduct.price} onChange={handleInputChange} className='input' />
            </label>

            <label className='label box'>Moneda:
              <div className="select is-hovered is-rounded is-normal ml-3">
              <select name="change" value={hookProduct.change} onChange={handleInputChange} className='is-rounded'>
                <option value="">Seleccione la moneda</option>
                <option value="ars">Pesos</option>
                <option value="usd">Usd</option>
              </select>
              </div>
            </label>

            <label className='label box'>Cantidad:
              <input type="number" name='quantity' value={hookProduct.quantity} onChange={handleInputChange} className='input' />
            </label>
            <button className='button is-warning m-1' type='submit' onClick={validateForm}>{isUpdatingProduct ? <Loader/> : "Actualizar"}</button>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default EditProducts