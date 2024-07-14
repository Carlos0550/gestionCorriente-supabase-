import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../../context';
import { useNavigate } from 'react-router-dom';
import Item from 'antd/es/list/Item';
const ClientHistory = ({ closeModal }) => {
  const {fetchHistoryClient, clientHistory} = useAppContext()
  const navigate = useNavigate()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      closeModal();
    }, 0);
  };

  useEffect(()=>{
    console.log(clientHistory)
        console.log("llamando")
        fetchHistoryClient()
  },[navigate])


 
  return (
    <>
      <Modal
        title=""
        visible={true}
        onOk={handleOk}
        okText="Cancelar"
        width={1000}
        confirmLoading={confirmLoading}
        footer={[
          <Button key="update" type="primary" onClick={handleOk} loading={confirmLoading}>
            Cerrar
          </Button>,
        ]}
        closeIcon={false}
      >
        <div className="control">
            <div className="columns">
                <div className="column">
                    <h1 className='title is-color-black'>Historial de {clientHistory.map(Item => Item.nombre_completo)[0]}</h1>
                    {clientHistory && clientHistory
                    .slice()
                    .reverse()
                    .map((item,index)=>{
                        return(
                            <div className="box" key={index}>
                                <div className="box is-background-info"><div className="box is-background-white is-color-black has-text-weight-bold">Fecha de cancelación: {item.fecha_cancelacion}</div></div>
                                <div className="box is-background-white is-color-black has-text-weight-bold">Nombre: x{item.quantity} {item.nombre_producto}</div>
                                <div className="box is-background-white is-color-black has-text-weight-bold">Fecha de compra: {item.fecha_compra}</div>
                                <div className='box is-background-white is-color-black has-text-weight-bold'> 
                                    {item.moneda === "usd" ? 
                                         `Código: x${item.precio_producto}`
                                    : ""}
                                    {item.moneda === "ars" ? 
                                        `Precio: $${item.precio_producto * item.quantity} ARS`
                                    : ""}
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default ClientHistory;
