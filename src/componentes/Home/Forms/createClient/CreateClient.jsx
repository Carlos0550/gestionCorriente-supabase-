import React, { useState } from 'react';
import { Button } from '@mui/material';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context';
import './CreateClient.css';

function CreateClient() {
  const { createUser, isCreating, userExists } = useAppContext();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fullName: '',
    apodo: '',
    dni: '',
    phone: '',
    street: '',
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)
  const validateForm = async (ev) => {
    ev.preventDefault();
    if (!values.fullName) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setShowAlert(false);
      message.loading('Creando fichero de cliente, aguarde...');
      await createUser(values);
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 10000); 
    }
  };

  return (
    <div className="container custom__container-createUser">
      <h1 className="title is-color-black">Crear ficha de cliente</h1>
      <form onSubmit={validateForm} className="form-createClient">
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label is-color-black is-size-5">Nombre completo:</label>
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                className="input"
                onChange={handleInputChange}
              />
              <span className={`tag ${showAlert ? 'is-danger' : 'is-info'} is-color-black is-size-6 mt-2`}>
                Este campo es obligatorio
              </span>
            </div>

            <div className="field">
              <label className="label is-color-black is-size-5">DNI:</label>
              <input
                type="text"
                name="dni"
                value={values.dni}
                className="input"
                onChange={handleInputChange}
              />
              {!userExists ? (
                <span className="tag is-warning is-size-6 m-2">Recomendado</span>
              ) : (
                <span className="tag is-danger is-color-black is-size-5 m-2">
                  Ya existe un usuario con este DNI
                </span>
              )}
            </div>

            <div className="field">
              <label className="label is-color-black is-size-5">Apodo:</label>
              <input
                type="text"
                name="apodo"
                value={values.apodo}
                className="input"
                onChange={handleInputChange}
              />
              <span className="tag is-warning is-color-white is-size-6 is-color-black m-2">
                Recomendado
              </span>
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label className="label is-color-black is-size-5">Teléfono:</label>
              <input
                type="text"
                name="phone"
                value={values.phone}
                className="input"
                onChange={handleInputChange}
              />
              <span className="tag is-normal is-color-white is-size-6 is-background-black m-2">
                Opcional
              </span>
            </div>

            <div className="field">
              <label className="label is-color-black is-size-5">Dirección:</label>
              <input
                type="text"
                name="street"
                value={values.street}
                className="input"
                onChange={handleInputChange}
              />
              <span className="tag is-normal is-color-white is-size-6 is-background-black m-2">
                Opcional
              </span>
            </div>
          </div>
        </div>

        {/* <div className="field">
          {showAlert && (
            <div className="field">
              <Alert severity="error">
                Debe completar los campos que sean{' '}
                <strong className="subtitle has-text-weigth-bold has-text-danger is-size-6">obligatorios</strong>
              </Alert>
            </div>
          )}
        </div> */}

        <div className="field">
          <Button
            variant="contained"
            disabled={isCreating}
            type="submit"
            style={{ backgroundColor: isCreating ? 'grey' : '' }}
          >
            {isCreating ? 'Aguarde...' : 'Guardar Cliente'}
          </Button>
          {showSuccess ? <span className='tag is-success is-size-4 has-text-weight-bold'>Usuario creado, cambie a buscar cliente para visualizar el fichero del nuevo cliente</span> : ""}

        </div>
      </form>
    </div>
  );
}

export default CreateClient;
