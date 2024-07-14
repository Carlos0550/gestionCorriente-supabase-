import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import Loader from '../../Loaders/Loader';
import "./viewDeliverRegister.css"

function ViewDeliverys({ closeModal, total_entregas }) {
  const { deliverData, fetchingDeliverys } = useAppContext();

  const handleOk = () => {
    closeModal();
  };


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
              <p className='has-text-weight-bold is-size-4'>Total en entregas: ${total_entregas}</p>
            </label>
            {fetchingDeliverys ? (
              <Loader />
            ) : (
              deliverData.length > 0 ? (
                <div className="table-container">
                  <table className="table is-fullwidth is-bordered is-hoverable">
                    <thead>
                      <tr>
                        <th className='has-text-weight-bold is-size-4'>Fecha</th>
                        <th className='has-text-weight-bold is-size-4'>Monto entregado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverData
                        // .slice() // copia de array para evitar mutaciones
                        // .reverse()
                        .map((item, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td className='has-text-weight-bold is-size-5'>{item.fecha_entrega}</td>
                              <td className='has-text-weight-bold is-size-5'>${item.monto_entrega}
                                {index === deliverData.length -1 ? <span className='tag is-danger is-size-6 ml-5 m-1'>Ultima entrega</span> : ""}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </tbody>
                  </table>
                </div>
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
