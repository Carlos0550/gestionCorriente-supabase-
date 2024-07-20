import React, { useState, useEffect } from 'react'
import { Button, Modal, message } from 'antd';
import "./editProducts.css"
import { useAppContext } from '../../../../context';
import Loader from '../../../../Loaders/Loader';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../../Auth/supabase';

function EditProducts({ closeModal, idProduct }) {
  console.log("Recibí el id n°: ", idProduct);

  const navigate = useNavigate();
  const { updateProduct, isUpdatingProduct } = useAppContext();
  const [dataProduct, setDataProduct] = useState([]);
  const [newValues, setNewValues] = useState({
    id: "",
    change: "",
    nameProduct: "",
    price: "",
    date: "",
    quantity: ""
  });

  const handleOk = () => {
    closeModal();
  };

  const findDebt = async () => {
    const hiddenMessage = message.loading("Aguarde...", 0);

    try {
      const { data, error } = await supabase
        .from("debts")
        .select()
        .eq("id", idProduct);

      if (error) {
        hiddenMessage();
        message.error("Hubo un problema al intentar editar el producto", 3);
        console.log(error);
      } else if (data.length > 0) {
        setDataProduct(data[0]);
        hiddenMessage();
      }
    } catch (error) {
      message.error("Hubo un problema al intentar editar el producto", 3);
    } finally {
      hiddenMessage();
    }
  };

  useEffect(() => {
    if (idProduct) {
      findDebt();
    }
  }, [idProduct]);

  useEffect(() => {
    if (dataProduct) {
      setNewValues({
        id: dataProduct.id,
        change: dataProduct.change,
        nameProduct: dataProduct.nameProduct,
        price: dataProduct.price,
        date: dataProduct.buyDate,
        quantity: dataProduct.quantity,
      });
    }
  }, [dataProduct]);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setNewValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = async (ev) => {
    ev.preventDefault();
    if (!newValues.nameProduct || !newValues.price || !newValues.change || !newValues.quantity) {
      message.error("¡No puede haber ningún campo vacío!");
      return;
    } else if (parseInt(newValues.quantity) < 1) {
      message.error("La cantidad insertada no puede ser menor a 1");
      return;
    } else if (parseFloat(newValues.price) <= 0) {
      message.error("El precio debe ser un valor numérico mayor a 0");
      return;
    } else {
      await updateProduct(newValues);
      closeModal();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

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
          <div className="columns">
            {/*Antiguo producto*/}
            {/* <div className="column">
              <form className='form-addProduct' >
                <h1 className='title is-color-white is-size-2 has-text-centered'>Antiguo producto</h1>
                <ul >
                  <li className='box is-background-white'>
                    <h1 className='title is-color-black is-size-3'>- {hookProduct.nameProduct}</h1>
                    {hookProduct.change === "ars" ? <h1 className='title is-color-black is-size-3'>- Precio unitario: ${hookProduct.price}</h1> : ""}
                    {hookProduct.change === "usd" ? <h1 className='title is-color-black is-size-3'>- Código: x{hookProduct.price}</h1> : ""}
                    <h1 className='title is-color-black is-size-3'>- Cantidad: {hookProduct.quantity} unidad/es</h1>
                  </li>
                </ul>
              </form>
            </div> */}
            <div className="column">
              <form className='form-addProduct'>
                <h1 className='title is-color-white is-size-2 has-text-centered'>Editar producto</h1>
                <label className='label box is-color-black is-size-4' style={{ backgroundColor: "#ffffff" }}>Nombre producto:
                  <input type="text" name='nameProduct' value={newValues.nameProduct} onChange={handleInputChange} className='input is-color-white is-background-black is-size-5' />
                </label>

                <label className='label box is-color-black is-size-4' style={{ backgroundColor: "#ffffff" }}>Precio Unitario:
                  <input type="text" name='price' value={newValues.price} onChange={handleInputChange} className='input is-color-white is-background-black is-size-5' />
                </label>

                <label className='label box is-color-black is-size-4' style={{ backgroundColor: "#ffffff" }}>Moneda:
                  <div className="select is-hovered is-rounded is-normal ml-3">
                    <select name="change" value={newValues.change} onChange={handleInputChange} className='is-rounded is-size-5'>
                      <option value="">Seleccione la moneda</option>
                      <option value="ars">Pesos</option>
                      <option value="usd">Usd</option>
                    </select>
                  </div>
                </label>

                <label className='label box is-color-black is-size-4' style={{ backgroundColor: "#ffffff" }}>Cantidad:
                  <input type="text" name='quantity' value={newValues.quantity} onChange={handleInputChange} className='input is-color-white is-background-black is-size-5' />
                </label>

                <label className='label box is-color-black is-size-4' style={{ backgroundColor: "#ffffff" }}>Fecha de compra:
                  <input type="text" name='date' value={newValues.date} onChange={handleInputChange} className='input is-color-white is-background-black is-size-5' />
                </label>

                <button className='button is-warning m-1' type='submit' onClick={validateForm}>
                  {isUpdatingProduct ? <Loader /> : "Actualizar"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </Modal>
    </>
  )
}

export default EditProducts