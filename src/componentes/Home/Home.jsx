import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar'; // Asumiendo que Navbar está en el mismo directorio
import "./Home.css"; // Importa tus estilos CSS

import CreateClient from "./Forms/createClient/CreateClient";
import FindClient from "./Forms/FindUsers/FindClient";
import { useAppContext } from '../context';
import { supabase } from '../../Auth/supabase';
import { useNavigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material';

function Home() {
  const { setSelectedOption, selectedOption, findUser } = useAppContext();
  const [showClientOptions, setShowClientOptions] = useState(false);
  const [debtUsers, setDebtsUsers] = useState([]);
  const [showRetryBtn, setShowRetryBtn] = useState(false);

  const handleChangeOptions = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChangeOption = () => {
    setShowClientOptions(!showClientOptions);
  };

  const date = new Date();
 

  const currentHour = date.getHours();

  const giveGreeting = () => {
    if (currentHour >= 5 && currentHour < 12) {
      return { type: "day" };
    } else if (currentHour >= 12 && currentHour < 19) {
      return { type: "afternoon" };
    } else {
      return { type: "night" };
    }
  };

  const { type } = giveGreeting();
  const [fetchingData, setFetchingData] = useState(false)
  const fetchDataUsers = async () => {
    setFetchingData(true)
    try {
      const { data, error } = await supabase
        .from("debts")
        .select();

      if (error) {
        setFetchingData(false)
        setShowRetryBtn(!showRetryBtn);
        return { errorType: "errorFethData" };
      }
      if (data.length > 0) {
        setFetchingData(false)
        setDebtsUsers(data);
        return { errorType: "successFetchData" };
      }
    } catch (error) {
      return { errorType: "errorServer" };
    } finally {
      setFetchingData(false)
    }
  };

  useEffect(() => {
    fetchDataUsers();
  }, []);

  useEffect(() => {
    console.log(debtUsers);
  }, [debtUsers]);

  //Agrupacion por nombres para las tablas
  const groupByClient = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.nombre_cliente]) { // verifica qsi el acumulador ya tiene una entrada para el nombre del cliente, y si no crea un nuevo array para ese cliente
        acc[item.nombre_cliente] = [];
      }
      acc[item.nombre_cliente].push(item); //añade la deuda actual (item) al array correspondiente del cliente
      return acc;
    }, {}); //se inciializa el acc vacio
  };


  const filterExpiredDebts = (data) => {
    const currentDate = new Date();
    return data.filter(item => {
      const [day, month, year] = item.buyDate.split('-').map(Number); //Divide la fecha de compra (buyDate) en día, mes y año, y los convierte a números.
      const buyDate = new Date(year, month - 1, day);
      const diffTime = Math.abs(currentDate - buyDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 30;
    });
  };

  const groupedClients = groupByClient(filterExpiredDebts(debtUsers));


  const renderClientsOptions = () => {
    return (
      <>
        <div className="columns ">
          <div className="column ">
            <section id="home__option-selector ">
              <h1 className='title is-color-black'>Seleccione una opción</h1>
              <div className="select is-normal is-rounded ">
                <select value={selectedOption} onChange={handleChangeOptions} className='is-hovered'>
                  <option value="añadirDeuda">Buscar un cliente</option>
                  <option value="agregarCliente">Crear un Cliente</option>
                </select>
              </div>
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
    )
  }

  const viewClient = (clientData) =>{
      const values = {
        fullName: clientData
      }
      findUser(values)
      setShowClientOptions(!showClientOptions)
  }

  return (
    <>
      <div className="home__wrapper is-background-white">
        <Navbar />

        <div className="columns">
          <div className="column">
            <div className='box '>
              {type === "day" &&
                <h1 className='title'>Buenos días, Claudia 👋🌅</h1>
              }
              {type === "afternoon" &&
                <h1 className='title'>Buenas tardes, Claudia 👋🌆</h1>
              }
              {type === "night" &&
                <h1 className='title'>Buenas noches, Claudia 👋🌃</h1>
              }

              <button className='button is-white' onClick={handleChangeOption}>{showClientOptions ? "Ocultar todo" : "Administrar clientes"}</button>
              <div className="column " style={{ display: showClientOptions ? "none" : "" }}>
                <div className="title is-white">{Object.keys(groupedClients).length > 0 ? "Deudas por vencer" : "Al dia de la fecha no hay deudas por vencer"}</div>
                <div className="custom-tableDebts" style={{display: Object.keys(groupedClients).length > 0 ? "" : "none"}}>
                {Object.keys(groupedClients).length > 0 ?
                  Object.keys(groupedClients).map((clientName, index) => {
                    const clientItems = groupedClients[clientName];
                    console.log(clientName)
                    return (
                      <div key={index}  style={{ display: fetchingData ? "none" : "" }}>
                        <div className='tabs is-medium'>
                          <ul>
                            <li className='is-active pr-3' style={{textTransform: "capitalize"}}><a>{clientName}</a></li>
                            <li><a><button className='button is-white ' onClick={()=>viewClient(clientName)}>Revisar fichero</button></a></li>
                          </ul>
                          
                        </div>
                      </div>
                    );
                  })
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
