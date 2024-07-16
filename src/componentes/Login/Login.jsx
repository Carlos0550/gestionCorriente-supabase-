import React, { useEffect, useState, useRef } from 'react'
import "./Login.css"

import { supabase } from '../../Auth/supabase'
import { useAppContext } from '../context'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Alert, LinearProgress, CircularProgress } from '@mui/material'
function Login() {
    const navigate = useNavigate()
    const { loginAdmin, invalidUser, loading, progress} = useAppContext()
    const [values, setValues] = useState({
        logemail: "",
        logpass: ""
    })
    const handleInput = (e) => {
        const { value, name } = e.target
        setValues((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }
    const [showAlert, setShowAlert] = useState(false)
    const verifyForm = (ev) => {
        ev.preventDefault()
        if (!values.logemail || !values.logpass) {
            setShowAlert(true)
        } else {
            loginAdmin(values)
        }
    }
    useEffect(() => {
        if (showAlert) {
            setTimeout(() => {
                setShowAlert(false)
            }, 3000)
        }
    }, [showAlert])
    let hasFetchedSession = useRef(false); // Ref para mantener el estado de la ejecución
    const [estaEjecutando, setEstaEjecutando] = useState(true);
    const executionCount = useRef(0); // Ref para mantener el conteo de ejecuciones
  
    useEffect(() => {
        if (!hasFetchedSession.current) {
            const retrieveSession = async () => {
              const { data, error } = await supabase.auth.getSession();
              if (data.session && data.session.user.id === process.env.REACT_APP_ADMIN_ID) {
                navigate("/home");
              }
                setEstaEjecutando(false); 
            };
      
            retrieveSession();
            hasFetchedSession.current = true; 
          }
        }, [navigate]);
  

    return (
        <>
            <div className="container custom__columns-login">
                <div className="columns">
                    <div className="column">
                        <div class="card">
                            <h4 className="title is-color-black">{estaEjecutando ? <LinearProgress /> : "Bienvenido/a a Gestión Corriente"}</h4>
                            <form>
                                <div className="field is-background-white">
                                    <TextField error={showAlert} helperText={showAlert ? "Correo inválido" : ""} label="Ingresa tu usuario" variant="outlined" name="logemail" type="email" value={values.logemail} onChange={handleInput} style={{ width: "100%" }} />
                                </div>
                                <div className="field is-background-white">
                                    <TextField error={showAlert} helperText={showAlert ? "Contraseña incorrecta" : ""} label="Ingresa tu contraseña" variant="outlined" name="logpass" type="password" value={values.logpass} onChange={handleInput} style={{ width: "100%" }} />
                                </div>
                                <div className={`${invalidUser ? 'field is-background-white': ""}`}>
                                    {invalidUser ? <Alert severity="error">Este correo no está autorizado</Alert> : ""}
                                </div>
                                <Button variant='contained' type="submit" style={{ cursor: loading || estaEjecutando ? "not-allowed" : "pointer" }} disabled={loading || estaEjecutando} onClick={verifyForm}>{estaEjecutando ? "Aguarde..." : "Iniciar Sesión"}</Button>
                                {loading ? <LinearProgress color="success" /> : ""}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login