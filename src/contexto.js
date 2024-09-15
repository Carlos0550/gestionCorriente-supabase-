import { message } from "antd";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import { supabase } from "./Auth/supabase";
import { useNavigate } from "react-router-dom";
import { config } from "./config";
export const AppContext = createContext();

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return ctx;
};

export const AppContextProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("clientes");
  const [clientData, setClientData] = useState([]);
  const [clientDebts, setClientDebts] = useState([]);
  const [clientDelivers, setClientDelivers] = useState([]);
  const [clientHistory, setClientHistory] = useState([]);
  const [vencimientos, setVencimientos] = useState([]);
  const [clientSuccess, setClientSuccess] = useState(false);
  const [errorStarting, setErrorStarting] = useState(false)
  const navigate = useNavigate()
  const createClients = async (values, hiddenMessage) => {
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/create-clients`,
        { values }
      );
      if (response.status === 200) {
        message.success("Cliente creado exitosamente");
        setClientSuccess(true);
        fetchClients(hiddenMessage);
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };
  const fetchClients = async (hiddenMessage) => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/get-all-clients`);
      if (response.status === 200) {
        setErrorStarting(false)
        setClients(response.data);
      } else {
      setErrorStarting(true)
        message.error(`${response.data.message}`);
      }
    } catch (error) {
    setErrorStarting(true)
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };
  const fetchDebtsClient = async (clientID) => {
    setClientDebts([]);
    setClientDelivers([]);
    setClientData([]);
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/get-debts-client?clientID=${clientID}`
      );
      if (response.status === 200) {
        setClientData(response.data.clientData);
        setClientDebts(response.data.deudas);
        setClientDelivers(response.data.entregas);
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    }
  };

  const [uploadSuccess, setUploadSucess] = useState(false);
  const addDebts = async (products, clientID, clientName) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/add-debts?clientID=${clientID}&clientName=${clientName}`,
        products
      );
      if (response.status === 200) {
        setUploadSucess(true);
        await fetchDebtsClient(clientID);
        message.success("Productos añadidos correctamente!");
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const makeDeliver = async (clientID, clientName, entrega) => {
    const hiddenMessage = message.loading("Aguarde...", 0);
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/make-deliver?clientID=${clientID}&clientName=${clientName}`,
        entrega
      );
      if (response.status === 200) {
        await fetchDebtsClient(clientID);
        message.success("Entrega añadida correctamente!");
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const cancelAllDebts = async (values) => {
    const hiddenMessage = message.loading("Cancelando fichero...", 0);

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/cancel-debts`,
        values
      );
      if (response.status === 200) {
        setClientDebts([]);
        setClientDelivers([]);
        message.success("Deudas canceladas correctamente!");
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const fetchHistory = async (clientID) => {
    setClientHistory([]);
    const hiddenMessage = message.loading("Espere...");
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/get-history?clientID=${clientID}`
      );
      if (response.status === 200) {
        setClientHistory(response.data);
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const getVencimientos = async (hiddenMessage) => {
    setVencimientos([]);
    try {
      await getExpirations()
      const response = await axios.get(`${config.apiBaseUrl}/get-view-vencimientos`);
      if (response.status === 200) {
        setErrorStarting(false)
        setVencimientos(response.data);
      } else {
        setErrorStarting(true)
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      setErrorStarting(true)
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    } finally {
      hiddenMessage();
    }
  };

  const deleteProduct = async (idProduct,clientID) => {
    const hiddenMessage = message.loading("Eliminando...", 0);
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/delete-product?idProduct=${idProduct}`);
      if (response.status === 200) {
        hiddenMessage();
        message.success("Producto Eliminado!");
        fetchDebtsClient(clientID)
      } else {
        hiddenMessage();
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    }finally{
        hiddenMessage();
    }
  };

  const deleteDeliver = async (idDeliver,clientID) => {
    const hiddenMessage = message.loading("Eliminando...", 0);
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/delete-deliver?idDeliver=${idDeliver}`);
      if (response.status === 200) {
        hiddenMessage();
        message.success("Entrega Eliminada!");
        fetchDebtsClient(clientID)
      } else {
        hiddenMessage();
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        message.error(`${error.response.data.message}`);
      } else {
        message.error(
          "Error de conexión, verifique su internet e intente nuevamente"
        );
      }
    }finally{
        hiddenMessage();
    }
  };

  const login = async(values) =>{
    const hiddenMessage = message.loading("Aguarde...")
    try {
      const {data,error} = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      })
      if (data.user === null) {
        message.error("Correo o contraseña incorrectos")
      }else{
        message.info("Sesión iniciada!")
        navigate("/home")
      }
    } catch (error) {
      console.log(error)
      message.error("Error de red: Verifique su conexión e intente nuevamente")
    }finally{
      hiddenMessage()
    }
  }
  const alreadyGet = useRef(false)
  const getSession = async() =>{
    if (!alreadyGet.current) {
      alreadyGet.current = true;
      const hiddenMessage = message.loading("Aguarde...",0)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          hiddenMessage()
          message.info("Sesión expirada o inválida")
          navigate("/")
        }else{
          message.success("Bienvenido nuevamente!")
          navigate("/home")
        }
      } catch (error) {
        console.log(error)
        message.error("Error de red: Verifique su conexión e intente nuevamente")
      }finally{
        hiddenMessage()
       
      }
    }
  }

  const SwitchChange = async (checked,uuid,hiddenMessage) => {
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ buen_pagador: checked })
        .match({ uuid: uuid });

      if (error) {
        throw error;
      }

      message.success('Cliente Actualizado correctamente!');
      fetchClients(hiddenMessage)
    } catch (error) {
      console.error('Error al actualizar buen_pagador:', error);
      message.error('Error al actualizar el estado de buen_pagador');
    }
  };

  const [errorGettingExpirations, setErrorGettingExpirations] = useState(false)
  const getExpirations = async() => {
    const hiddenMessage = message.loading("Aguarde...",0) 
    try {
      const response = await axios.put(`${config.apiBaseUrl}/get-expirations`)
      if (response.status === 200) {
        hiddenMessage()
        setErrorGettingExpirations(false)
        message.success("Vencimientos obtenidos")
      }else{
        hiddenMessage()
        message.error(`${response.data.message}`)
        setErrorGettingExpirations(true)
      }
    } catch (error) {
      hiddenMessage()
      if (error.response) {
        message.error(`${error.response.data.message}`)
        setErrorGettingExpirations(true)
      }
      else{
        message.error("Error de conexión, verifique su internet e intente nuevamente")
        setErrorGettingExpirations(true)
      }
    }
  }

  const editClientData = async(values) => {
    const hiddenMessage = message.loading("Aguarde...",0)
    try {
      const response = await axios.put(`${config.apiBaseUrl}/edit-client`, values)
      hiddenMessage()
      if (response.status === 200) {
        message.success(`${response.data.message}`)
        fetchClients(hiddenMessage)
      }else{
        message.error(`${response.data.message}`,3)
      }
    } catch (error) {
      console.log(error)
      hiddenMessage()
      if (error.response) {
        message.error(`${error.response.data.message}`,3)
      }else{
        message.error("Error de conexión, verifique su conexión e intente nuevamente")
      }
    }
  }

  const [deletingUser, setDeletingUser] = useState(false)
  const deleteClient = async (uuid) => {
    const hiddenMessage = message.loading("Eliminando...",0)
    setDeletingUser(true)
    try {
      const response = await axios.delete(`${config.apiBaseUrl}/delete-client?uuid=${uuid}`);
      hiddenMessage()
      setDeletingUser(false)
      if (response.status === 200) {
        setDeletingUser(false)
        console.log("Cliente eliminado exitosamente.");
        message.success("Cliente eliminado exitosamente.");
        fetchClients(hiddenMessage)
      } else {
        console.error("Error en la eliminación del cliente.");
        message.error("Error en la eliminación del cliente.");
      }
    } catch (error) {
      hiddenMessage()
      setDeletingUser(false)
      console.error("Error al intentar eliminar el cliente:", error);
      if (error.response) {
        message.error(`Error: ${error.response.data.message || "Error en el servidor."}`);
      } else {
        message.error("Error de conexión. Por favor, intente nuevamente más tarde.");
      }
    }
  };
  
  return (
    <AppContext.Provider
      value={{
        createClients,
        clientSuccess,
        setActiveTab,
        activeTab,
        //Relacionado a clientes
        fetchClients,
        clients,
        fetchDebtsClient,
        clientDebts,
        clientDelivers,
        setClientDelivers,
        makeDeliver,
        clientData,
        setClientData,
        addDebts,
        uploadSuccess,
        cancelAllDebts,
        clientHistory,
        fetchHistory,
        getVencimientos,
        vencimientos,
        deleteProduct,deleteDeliver,login,getSession,SwitchChange,
        errorGettingExpirations, getExpirations,
        errorStarting,
        editClientData,
        deleteClient,deletingUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
