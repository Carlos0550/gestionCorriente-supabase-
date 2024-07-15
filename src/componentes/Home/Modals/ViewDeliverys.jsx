import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import { useAppContext } from '../../context';
import "./viewDeliverRegister.css"
import { LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ViewDeliverys({ closeModal, saldo_restante }) {
  const navigate = useNavigate()
  const { deliverData, fetchingDeliverys } = useAppContext();

  const handleOk = () => {
    closeModal();
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        closeModal();
    }
};

useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [navigate]);

  return (
    <Modal
      title=""
      visible={true}
      onOk={handleOk}
      closeIcon={false}
      width={1800}
      footer={[
        <Button type="primary" danger onClick={handleOk} className='btn_closeModalEditProduct'>
          Cerrar
        </Button>,
      ]}
    >
      <div className='container'>
        <div className="columns">
          <div className="column">
            
            {fetchingDeliverys ? (
              <LinearProgress />
            ) : (
              deliverData.length > 0 ? (
                <div className="table-container">
                  <table className="table is-fullwidth is-bordered is-hoverable">
                    <thead>
                      <tr>
                        <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Fecha</th>
                        <th className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Monto entregado</th>
                        <td className='has-text-weight-bold is-color-white is-size-5 has-text-weigth-bold is-background-black'>Saldo total: ${saldo_restante}</td>
                      </tr>
                    </thead>
                    <tbody>
                      {deliverData
                        // .slice() // copia de array para evitar mutaciones
                        // .reverse()
                        .map((item, index) => (
                          <React.Fragment key={index}>
                            <tr>
                              <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>{item.fecha_entrega}</td>
                              <td className='has-text-weight-bold is-color-black is-size-5 has-text-weigth-bold is-background-white'>${item.monto_entrega}
                                {index === deliverData.length -1 ? <span className='tag is-danger is-size-6 ml-5 m-1'>Ultima entrega</span> : ""}
                              </td>
                              <td className='is-background-white'></td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p id='deliverRegister__p' className='box is-size-5'>No hay entregas</p>
              )
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ViewDeliverys;
