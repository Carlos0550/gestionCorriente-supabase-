import { message } from "antd";
import { createContext, useContext, useState } from "react";
import axios from "axios"
export const AppContext = createContext()

export const useAppContext = () => {
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return ctx
}

export const AppContextProvider = ({ children }) => {
    const [clients, setClients] = useState([])
    const [activeTab, setActiveTab] = useState('clientes');
    const [clientDebts, setClientDebts] = useState([])
    const [clientDelivers, setClientDelivers] = useState([])
    const fetchClients = async() =>{
        try {
            const response = await axios.get("http://localhost:4000/get-all-clients")
            if (response.status === 200) {
                setClients(response.data)
            }else{
                message.error(`${response.data.message}`)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.data.message}`)
            }else{
                message.error("Error de conexión, verifique su internet e intente nuevamente")
            }
        }
    };

    const fetchDebtsClient = async(clientID) =>{
        try {
            const response = await axios.get(`http://localhost:4000/get-debts-client?clientID=${clientID}`)
            if (response.status === 200) {
                setClientDebts(response.data.deudas)
                setClientDelivers(response.data.entregas)
            }else{
                message.error(`${response.data.message}`)
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                message.error(`${error.response.data.message}`)
            }else{
                message.error("Error de conexión, verifique su internet e intente nuevamente")
            }
        }
    }
    return (
        <AppContext.Provider
            value={{
                setActiveTab,activeTab,
                //Relacionado a clientes
                fetchClients,clients,fetchDebtsClient,clientDebts,clientDelivers, setClientDelivers

            }}
        >
            {children}
        </AppContext.Provider>
    )
}