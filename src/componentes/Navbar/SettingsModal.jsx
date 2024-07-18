import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { Button, TextField } from '@mui/material';
import { supabase } from "../../Auth/supabase";
import { useAppContext } from '../context';

const SettingsModal = ({ closeModal }) => {
    const {setUsdPrice,usdPrice} = useAppContext()
  const [usdValue, setUsdValue] = useState("");

  const handleInput = (e) => {
    setUsdValue(e.target.value);
  };

  const handleSaveConfig = async () => {
    message.loading("Guardando...");
    if (!usdValue) {
      message.error("El valor del dólar no puede estar vacío");
      return;
    }

    try {
      const { data,error } = await supabase
        .from('usdPrice')
        .update({ 
            value: usdValue
         })
        .eq('id', 1)
        .select()

        console.log(error)
        console.log(data)
      if (error) {
        message.error("Hubo un error, por favor intente nuevamente");
      } else {
        message.success("Dólar guardado");
        setUsdPrice([
            {
                value: usdValue
            }
        ])
      }
    } catch (error) {
      console.error("Error guardando el valor del dólar:", error);
      message.error("Hubo un error, por favor intente nuevamente");
    }
  };

  return (
    <Modal
      title={<h1 className='title has-text-centered is-color-black m-1 p-1'>Ajustes</h1>}
      visible={true}
      onCancel={closeModal}
      footer={[
        <Button key="close" variant="contained" color="error" className='m-1' onClick={closeModal}>Cerrar</Button>,
        <Button key="save" variant="contained" className='m-1' onClick={handleSaveConfig}>Guardar</Button>
      ]}
      width={650}
    >
      <div className="container">
        
        <div className="field">
        <div className="label is-color-black">Precio actual: ${usdPrice.map(el=> el.value)}</div>

          <TextField 
            id="outlined-basic" 
            label="Ingresa el precio del dólar" 
            variant="outlined"
            value={usdValue}
            onChange={handleInput}
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
