import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../../context';
import "./productModal.css";

const ProductModal = ({ closeModal }) => {
  const { clientData, addDebt, addingDebt, fullDate } = useAppContext();
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  
    let hasError = false; // Variable para manejar errores
  
    // Dividir el texto en líneas usando comas y saltos de línea
    const productLines = values.products
      .toLowerCase() // Convertir todo a minúsculas
      .split(/,|\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  
    const productsToAdd = productLines.map(line => {
      const [quantity, ...rest] = line.split(' ');
      const restStr = rest.join(' ');
  
      // Intentar dividir el resto de la cadena en nombre y precio
      const parts = restStr.split(/(\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?$)/).filter(Boolean);
  
      // Verificar si las partes son válidas y contienen precio
      if (parts.length < 2) {
        hasError = true; // Marcar como error
        return null; // Devolver null para filtrar más tarde
      }
  
      const [nameProduct, price] = parts;
      const change = restStr.includes('x') ? 'usd' : 'ars';
  
      // Validar precio y cantidad
      if (!price || isNaN(parseFloat(price.replace('x', '')))) {
        hasError = true; // Marcar como error
        return null; // Devolver null para filtrar más tarde
      }
  
      return {
        nameProduct: nameProduct.trim(),
        quantity: parseInt(quantity, 10) || 1,
        price: parseFloat(price.replace('x', '')),
        change: change,
        buyDate: values.buyDate,
        nombre_cliente: values.nombre_cliente,
        apellido_cliente: values.apellido_cliente,
        uuid: values.uuid
      };
    }).filter(product => product !== null); // Filtrar productos inválidos
  
    const dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
  
    if (!values.products) {
      hasError = true;
    } else if (values.buyDate && !dateRegex.test(values.buyDate)) {
      hasError = true;
    }
  
    if (hasError) {
      message.error("1 o más líneas están mal formadas. Asegúrese de incluir precio y cantidad.");
      return; // No continuar con el envío si hay errores
    }
  
    // Enviar cada producto al servidor
    for (const product of productsToAdd) {
      await addDebt(product);
    }
    closeModal();
  };
  

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
                  <div className='message-header is-size-5 is-color-white is-background-link'>
                    <p className='title'>¿Como insertar productos?</p>
                  </div>
                  <div className='message-body '>
                    <ol >
                      <li className='is-size-5 is-color-black'>El formato esperado es (Cantidad) seguido de (detalle o nombre del producto) seguido del código o el monto</li>
                      <ol type='A' className='ml-5'>
                        <li className='is-size-5 is-color-link'>Ejemplo en pesos: 1 mate de arpillera 25000</li>
                        <li className='is-size-5 is-color-link'>Ejemplo en código: 1 mate de arpillera x15 <span className='tag is-danger is-size-5'>Importante no olvidar la equis "x"</span></li>
                      </ol>
                      <li className='is-size-5 is-color-black'>Para insertar varios productos puede añadir una coma "," al final o simplemente presionar Enter para ir agregando uno abajo del otro</li>
                    </ol>
                  </div>
                </article>
                <div className="field">
                  <label className='label box is-background-white is-color-black is-size-5'>Productos: <span className='tag is-danger is-size-6 m-1'>Requerido</span>
                    <textarea 
                      name='products' 
                      value={values.products} 
                      onChange={handleInputChange} 
                      className='textarea is-color-white is-background-black is-size-5'
                      rows="10"
                    />
                  </label>

                  <label className='label is-color-black is-size-5'>Fecha de compra <span className='tag is-info is-size-6 m-1'>Opcional</span>
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
                className='button is-size-5 is-success m-3' 
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
