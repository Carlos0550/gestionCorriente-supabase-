import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function NotFound() {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate("https://gestioncorriente-client.onrender.com/")
    },[])
  return (
    <div>Pagina no encontrada</div>
  )
}

export default NotFound