import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import { useAppContext } from '../../context';
import Loader from '../../Loaders/Loader';
import "./viewDeliverRegister.css"
function ViewDeliverys({ closeModal, total_entregas }) {
  const { deliverData, fetchingDeliverys } = useAppContext();

  const handleOk = () => {
    closeModal();
  };

  console.log("totalENtregas", total_entregas)

  return (
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

      <div className='container'>
        <div className="columns">
          <div className="column">
            <label className='label box'>
              <p>Total de entregas ${total_entregas}</p>
            </label>
            {fetchingDeliverys ? (
              <Loader />
            ) : (
              deliverData.length > 0 ? (
                deliverData.map((item, index) => (
                  <div key={index} className='box'>
                    <label className='label is-color-black'>
                      <p>El día <strong className='has-text-weight-bold is-color-black'>{item.fecha_entrega}</strong> se hizo una entrega de: <strong className='has-text-weight-bold is-color-black'>${item.monto_entrega}</strong></p>
                    </label>
                  </div>
                ))
              ) : (
                <p id='deliverRegister__p' className='box'>No hay entregas</p>
              )
            )}
          </div>
        </div>
      </div>

    </Modal>
  );
}

export default ViewDeliverys;
