import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'; // Assuming Navbar is in the same directory
import "./Home.css";


import CreateClient from "./Forms/createClient/CreateClient"
import FindClient from "./Forms/FindUsers/FindClient"
function Home() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChangeOptions = (event) => {
    setSelectedOption(event.target.value);

  };
  // const getGreeting = () => {
  //   const userName = "Claudia"
  //   const currentHour = new Date().getHours()
  //   if (currentHour > 0 && currentHour < 12) {
  //     return `Buenos días, ${userName}`
  //   } else if (currentHour > 12 && currentHour < 19) {
  //     return `Buenas Tardes, ${userName}`
  //   } else {
  //     return `Buenas noches, ${userName}`
  //   }
  // }
  return (
    <>
      <div className="home__wrapper">
        <Navbar />
        <section id="home__option-selector">
            {/* <h1>{getGreeting()}</h1> */}
            <h1 className='home__h1'>Bienvenido/a a Gestión Corriente</h1>
            <select value={selectedOption} onChange={handleChangeOptions} className='selector'>
              <option value="">Selecciona una opción</option>
              <option value="agregarCliente">Crear un Cliente</option>
              <option value="añadirDeuda">Añadir una Deuda</option>
            </select>

          </section>

      </div>
      {selectedOption !== "" && <div className='componentHome'>
        {selectedOption === "agregarCliente" && <CreateClient /> || selectedOption === "añadirDeuda" && <FindClient />}

      </div>}
    </>
  );
}

export default Home;
