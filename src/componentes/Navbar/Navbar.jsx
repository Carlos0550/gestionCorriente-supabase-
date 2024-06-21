import React from 'react'
import "./navbar.css"
import { useAppContext } from '../context'
function Navbar() {
const {closeSession,isClossing} = useAppContext()
  return (
    <>
      <header className='header'>
        <h1 className='logo'>Gestión Corriente</h1>
        <nav className='navbar'>
          
          <button className='closeSession-desktop' disabled={isClossing} style={{backgroundColor: isClossing ? "grey" : ""}} onClick={closeSession}>{isClossing ? "Aguarde...":"Cerrar Sesión"}</button>
        </nav>

        {/* <form id="mobile-menu">
          <label for="btn-menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="auto" fill="snow" class="bi bi-list"
              viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
          </label>
          <input type="checkbox" id="btn-menu" />
          <nav>
            
            <button className='closeSession'>Cerrar Sesión</button>
          </nav>
        </form> */}
      </header>
    </>
  )
}

export default Navbar