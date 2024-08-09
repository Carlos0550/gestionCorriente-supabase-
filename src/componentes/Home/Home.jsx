import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Select, message } from 'antd';
import "./Home.css";
import CreateClient from "./Forms/createClient/CreateClient";
import FindClient from "./Forms/FindUsers/FindClient";
import { useAppContext } from '../context';
import { useFetchDebts } from './UtilidadesInicio/useFetchDebts';
import { filterAndGroupOldDebts } from './UtilidadesInicio/utils';
function Home() {
  const { setSelectedOption, selectedOption, findUser } = useAppContext();
  const [showClientOptions, setShowClientOptions] = useState(true);
  const { debtUsers, fetchDataUsers } = useFetchDebts();
  const refreshUserDebts = async () => {
    const hideMessage = message.info("Actualizando...", 0)
    await fetchDataUsers()
    hideMessage()
  }
  const handleChangeOptions = (value) => {
    setSelectedOption(value);
  };

  const handleChangeOption = () => {
    setShowClientOptions(!showClientOptions);
  };

  const giveGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Buenos días, Claudia ☀️";
    } else if (currentHour >= 12 && currentHour < 19) {
      return "Buenas tardes, Claudia 🌇";
    } else {
      return "Buenas noches, Claudia 🌙";
    }
  };

  const overdueClients = filterAndGroupOldDebts(debtUsers);

  const renderClientsOptions = () => (
    <>
      <div className="columns ">
        <div className="column ">
          <section id="home__option-selector ">
            <Select
              showSearch
              status='black'
              style={{
                width: 300,
                height: 50,
                border: '2px solid black',
                borderRadius: "8px",
                outline: "none"
                
              }}
              placeholder="Buscá una de las opciones"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              onChange={handleChangeOptions}
              options={[
                {
                  value: 'añadirDeuda',
                  label: 'Buscar clientes',
                },
                {
                  value: 'agregarCliente',
                  label: 'Crear cliente',
                }
              ]}
            />
          </section>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          {selectedOption === "agregarCliente" && (
            <div className="animated-component slide-component">
              <CreateClient />
            </div>
          )}
          {selectedOption === "añadirDeuda" && (
            <div className="animated-component slide-component">
              <FindClient />
            </div>
          )}
        </div>
      </div>
    </>
  );

  const viewClient = (clientData) => {
    findUser({ fullName: clientData.nombre_cliente });
    setShowClientOptions(!showClientOptions);
    setSelectedOption("añadirDeuda")
  };

  return (
    <>
      <div className="home__wrapper is-background-white">
        <Navbar />
        <div className="columns">
          <div className="column">
            <div className='box '>
              <h1 className='title'>{giveGreeting()}</h1>
              <button className='button is-white' onClick={handleChangeOption}>
                {showClientOptions ? "Revisar vencimientos" : "Administrar clientes"}
              </button>
              <div className="column " style={{ display: showClientOptions ? "none" : "" }}>
                <div className="title is-white">
                  {/* {clientList.length > 0 ? "Clientes con vencimientos" : "Al dia de la fecha no hay deudas por vencer"} */}
                </div>
                <div className="field">
                  <button className='button is-white' onClick={() => refreshUserDebts()}>Refrescar</button>
                  {/* {showRetryAlert ? <Flex gap="4px 0" wrap>
                  <Tag color='red' className='is-size-5 p-3 slide-component-alert'>Hubo un error al refrescar, por favor intente nuevamente</Tag>
                  </Flex> : ""} */}
                </div>
                <div className="custom-tableDebts" style={{ display: overdueClients.length > 0 ? "" : "none" }}>
                  {overdueClients.length > 0 ?
                    overdueClients.map((clientName, index) => (
                      <div key={index} >
                        <div className='tabs is-medium'>
                          <ul>
                            <li className='is-active pr-3' style={{ textTransform: "capitalize" }}>
                              <a className='subtitle is-size-4'>{clientName.nombre_cliente}</a>
                            </li>
                            {/* <li className='is-link pr-3'>
                              <a className='subtitle is-size-4'>Conteo de días a partir de la compra más antigua: {clientName.dias_vencido} días</a>
                            </li> */}
                            <li>
                              <a>
                                <button className='button is-white' onClick={() => viewClient(clientName)}>
                                  Revisar fichero
                                </button>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))
                    : "No hay nada por aquí..."}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns" style={{ display: showClientOptions ? "" : "none" }}>
          <div className="column">
            {renderClientsOptions()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
