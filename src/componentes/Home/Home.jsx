import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'; // Asumiendo que Navbar está en el mismo directorio
import "./Home.css"; // Importa tus estilos CSS

import CreateClient from "./Forms/createClient/CreateClient";
import FindClient from "./Forms/FindUsers/FindClient";
import { useAppContext } from '../context';

function Home() {
 const {setSelectedOption, selectedOption} = useAppContext()
  const handleChangeOptions = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <div className=" home__wrapper is-background-white ">
        <Navbar />
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
      </div>
    </>
  );
}
export default Home;
