import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import "./productModal.css";

const ProductModal = ({ closeModal }) => {
  const { clientData, addDebt, addingDebt, fullDate } = useAppContext();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      closeModal();
    }, 0);
  };

  const firstClient = clientData[0];

  const [values, setValues] = useState({
    products: "",
    buyDate: fullDate,
    nombre_cliente: firstClient.nombre_completo,
    apellido_cliente: firstClient.apellido,
    uuid: firstClient.uuid
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const processProducts = async (ev) => {
    ev.preventDefault();

    // Dividir el texto en líneas usando comas y saltos de línea
    const productLines = values.products.split(/,|\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    const productsToAdd = productLines.map(line => {
      const [quantity, ...rest] = line.split(' ');
      const restStr = rest.join(' ');
      const [nameProduct, price] = restStr.split(/(\d+(?:x\d+)?$)/).filter(Boolean);
      const change = restStr.includes('x') ? 'usd' : 'ars';
      return {
        nameProduct: nameProduct,
        quantity: parseInt(quantity),
        price: parseFloat(price.replace('x', '')),
        change: change,
        buyDate: values.buyDate,
        nombre_cliente: values.nombre_cliente,
        apellido_cliente: values.apellido_cliente,
        uuid: values.uuid
      };
    });

    const dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;

    if (!values.products) {
      message.error("El campo de productos no puede estar vacío");
    } else if (values.buyDate && !dateRegex.test(values.buyDate)) {
      message.error("La fecha debe tener el formato dd-mm-yyyy");
    } else {
      // Enviar cada producto al servidor
      for (const product of productsToAdd) {
        await addDebt(product);
      }
      closeModal();
    }
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     closeModal();
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [navigate]);

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
        footer={[]}
      >
        <div className='container p-3'>
          <div className="columns">
            <div className="column custom-column-addProduct is-background-black">
              <form className='form__addProduct' onSubmit={processProducts}>
                <h1 className='title is-color-white'>Agregar productos</h1>
                <article className='message  is-background-white is-flex'>
                  <div className='message-header is-size-5 is-color-white is-background-danger'>
                    <p className='title'>¿Como insertar productos?</p>
                  </div>
                  <div className='message-body '>
                    <ol >
                      <li className='is-size-5'>El formato es (Cantidad) seguido de (detalle o nombre del producto) seguido del codigo o el monto</li>
                      <ol type='A' className='ml-5'>
                        <li className='is-size-5 is-color-link'>Ejemplo en pesos: 1 mate de arpillera 25000</li>
                        <li className='is-size-5 is-color-link'>Ejemplo en dolares: 1 mate de arpillera x15 <span className='tag is-danger is-size-5'>Importante no olvidar la equis "x"</span></li>

                      </ol>
                      <li className='is-size-5'>Para insertar varios productos puede añadir una coma "," al final o simplemente precionar Enter para ir agregando uno abajo del otro</li>
                    </ol>
                  </div>
                </article>
                <div className="field">
                  <label className='label box is-background-white is-color-black is-size-5'>Productos:
                    <textarea 
                      name='products' 
                      value={values.products} 
                      onChange={handleInputChange} 
                      className='textarea is-color-white is-background-black is-size-5'
                      rows="10"
                      placeholder="(Cantidad) 1 (Detalle) Mate imperial de algarrobo (precio) 25000, 2 pulseritas de plata x15"
                    />
                  </label>

                  <label className='label is-color-black'>Fecha de compra (opcional):
                    <input 
                      type="text" 
                      name='buyDate' 
                      value={values.buyDate} 
                      onChange={handleInputChange} 
                      className='input is-color-black is-size-5' 
                    />
                  </label>
                </div>
              </form>
              <button 
                className='button is-size-5 is-warning m-3' 
                type='submit' 
                disabled={addingDebt} 
                style={{ cursor: addingDebt ? "not-allowed" : "" }} 
                onClick={processProducts}
              >
                {addingDebt ? "Aguarde..." : "Añadir al fichero"}
              </button>
              <Button 
                key="update" 
                type="primary" 
                onClick={handleOk} 
                loading={confirmLoading} 
                className='button is-size-5 is-danger m-3'
              >
                Cerrar Sección
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductModal;