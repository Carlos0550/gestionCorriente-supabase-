import React, { useEffect, useState } from 'react';
import { Button, Collapse, Modal, message, ConfigProvider, DatePicker } from 'antd';
import { useAppContext } from '../../../context';
import "./productModal.css";
import esES from 'antd/es/locale/es_ES'; 
import 'moment/locale/es';
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
    buyDate: "",
    nombre_cliente: firstClient.nombre_completo,
    apellido_cliente: firstClient.apellido,
    uuid: firstClient.uuid
  });

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { value, name } = e.target;
      setValues((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else if (e && e.format) {
      setValues((prevState) => ({
        ...prevState,
        buyDate: e.format('DD-MM-YYYY')
      }));
    }
  };

  useEffect(()=>{
    console.log(values.buyDate)
  },[values.buyDate])
  const processProducts = async (ev) => {
    ev.preventDefault();

    let hasError = false;

    const productLines = values.products
      .toLowerCase()
      .split(/,|\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const productsToAdd = productLines.map(line => {
      const [quantity, ...rest] = line.split(' ');

      // Validar que quantity exista y sea un número válido
      if (!quantity || isNaN(parseInt(quantity, 10))) {
        hasError = true;
        return null;
      }

      const restStr = rest.join(' ');

      // Verificar que el resto solo contenga caracteres, números y "x"
      const invalidChars = /[^a-zA-Z0-9x\s.]/;
      if (invalidChars.test(restStr)) {
        hasError = true;
        return null;
      }

      // Ajustar la expresión regular para manejar correctamente los precios con decimales
      const parts = restStr.split(/(\d+(?:\.\d+)?(?:x\d+(?:\.\d+)?)?)$/).filter(Boolean);

      if (parts.length < 2) {
        hasError = true;
        return null;
      }

      const [nameProduct, price] = parts;
      const change = restStr.includes('x') ? 'usd' : 'ars';

      if (!price || isNaN(parseFloat(price.replace('x', '')))) {
        hasError = true;
        return null;
      }

      return {
        nameProduct: nameProduct.trim(),
        quantity: parseInt(quantity, 10),
        price: parseFloat(price.replace('x', '')),
        change: change,
        buyDate: values.buyDate,
        nombre_cliente: values.nombre_cliente,
        apellido_cliente: values.apellido_cliente,
        uuid: values.uuid
      };
    }).filter(product => product !== null);

    const dateRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;

    if (!values.products) {
      hasError = true;
    } else if (values.buyDate && !dateRegex.test(values.buyDate)) {
      hasError = true;
    }

    if (hasError) {
      message.error("1 o más líneas están mal formadas. Asegúrese de incluir cantidad, nombre del producto sin símbolos, y precio.");
      return;
    }

    if (!values.buyDate) {
      message.error("Introduzca una fecha!", 3);
      return;
    }

    for (const product of productsToAdd) {
      await addDebt(product);
    }
    closeModal();
  };

  const text = (
    <div className='message-body '>
      <ul style={{margin: "1rem", listStyle:"disc"}}>
        <li className='is-size-5 is-color-black'>El formato esperado es (Cantidad) seguido de (detalle o nombre del producto) seguido del código o el monto</li>
        <ol type='A' className='ml-5'>
          <li className='is-size-5 is-color-link'>Ejemplo en pesos: 1 mate de arpillera 25000</li>
          <li className='is-size-5 is-color-link'>Ejemplo en código: 1 mate de arpillera x15 <span className='tag is-danger is-size-5'>Importante no olvidar la equis "x"</span></li>
        </ol>
        <li className='is-size-5 is-color-black'>Para insertar varios productos puede añadir una coma "," al final o simplemente presionar Enter para ir agregando uno abajo del otro</li>
      </ul>
    </div>
  );

  const items = [
    {
      key: "1",
      label: "Guía para insertar productos",
      children: [text]
    }
  ];

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
            <div className="column custom-column-addProduct is-background-white">
              <Collapse accordion items={items}/>
              <form className='form__addProduct' onSubmit={processProducts}>
              <div className="flex-container">
                  <div className="textarea-container">
                  <label className='label box is-background-white is-color-black is-size-5'>Productos:
                    <textarea 
                      name='products' 
                      value={values.products} 
                      onChange={handleInputChange} 
                      className='textarea is-color-black is-background-white is-size-5'
                      rows="10"
                    />
                  </label>
                  </div>

                  <div className="input-container">
                  <label className='label is-color-black is-size-5'>Fecha de compra 
                    {/* <input 
                      type="text" 
                      name='buyDate' 
                      value={values.buyDate} 
                      onChange={handleInputChange} 
                      className='input is-color-black is-size-5' 
                    /> */}
                    <ConfigProvider locale={esES}>
                        <DatePicker 
                        name='buyDate'
                        onChange={handleInputChange}
                        format={"DD-MM-YYYY"}
                        style={{width: "300px", fontSize: "30px", margin: "1rem"}}
                        />
                    </ConfigProvider>
                  </label>
                  </div>
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
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductModal;
