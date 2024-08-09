import React, { useState, useEffect } from 'react';
import { Button, Modal, message, ConfigProvider, DatePicker } from 'antd';
import { TextField, MenuItem } from '@mui/material';
import "./editProducts.css";
import { useAppContext } from '../../../context';
import Loader from '../../..//Loaders/Loader';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../Auth/supabase';
import esES from 'antd/es/locale/es_ES'; 
import 'moment/locale/es';

function EditProducts({ closeModal, idProduct }) {

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
    if (e && e.target) {
      const { value, name } = e.target;
      setNewValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else if (e && e.format) {
      setNewValues((prevState) => ({
        ...prevState,
        date: e.format('DD-MM-YYYY')
      }));
    }
  };
  useEffect(()=>{
    console.log(newValues.date)
  },[newValues.date])
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
            <div className="column">
              <form className='form-addProduct is-background-white'>
                <h1 className=' is-color-black is-size-3'>Editar producto</h1>
                <div className="flex-container">

                  <TextField
                    id="nameProduct"
                    label="Nombre producto"
                    name="nameProduct"
                    value={newValues.nameProduct}
                    onChange={handleInputChange}
                    variant="standard"
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    id="price"
                    label="Precio Unitario"
                    name="price"
                    value={newValues.price}
                    onChange={handleInputChange}
                    variant="standard"
                    fullWidth
                    margin="normal"
                  />
                </div>

                <div className="flex-container">
                <TextField
                  id="change"
                  label="Moneda"
                  name="change"
                  value={newValues.change}
                  onChange={handleInputChange}
                  variant="standard"
                  select
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="">Seleccione la moneda</MenuItem>
                  <MenuItem value="ars">Pesos</MenuItem>
                  <MenuItem value="usd">USD</MenuItem>
                </TextField>

                <TextField
                  id="quantity"
                  label="Cantidad"
                  name="quantity"
                  value={newValues.quantity}
                  onChange={handleInputChange}
                  variant="standard"
                  fullWidth
                  margin="normal"
                />
                </div>

                <div className="flex-container mt-5">
                <ConfigProvider locale={esES}>
                        <DatePicker 
                        name='date'
                        onChange={handleInputChange}
                        format={"DD-MM-YYYY"}
                        />
                    </ConfigProvider>
                </div>

                <button className='button is-warning m-1' type='submit' onClick={validateForm}>
                  {isUpdatingProduct ? <Loader /> : "Actualizar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditProducts;
