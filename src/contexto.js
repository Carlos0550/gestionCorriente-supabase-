import { message } from "antd";
import { createContext, useContext, useState } from "react";
import axios from "axios"
import { useRef } from "react";
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
    const [clientData, setClientData] = useState([])
    const [clientDebts, setClientDebts] = useState([])
    const [clientDelivers, setClientDelivers] = useState([])
    const [clientHistory, setClientHistory] = useState([])
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
        setClientDebts([])
        setClientDelivers([])
        setClientData([])
        try {
            const response = await axios.get(`http://localhost:4000/get-debts-client?clientID=${clientID}`)
            if (response.status === 200) {
                setClientData(response.data.clientData)
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

    const [uploadSuccess, setUploadSucess] = useState(false)
    const addDebts = async(products,clientID,clientName) => {
        const hiddenMessage = message.loading("Aguarde...",0)
        try {
            const response = await axios.post(`http://localhost:4000/add-debts?clientID=${clientID}&clientName=${clientName}`, products)
            if (response.status === 200) {
                setUploadSucess(true)
                await fetchDebtsClient(clientID)
                message.success("Productos añadidos correctamente!")
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
        }finally{
            hiddenMessage()
        }
    }

    const makeDeliver = async(clientID, clientName, entrega)=>{
        const hiddenMessage = message.loading("Aguarde...",0)
        try {
            const response = await axios.post(`http://localhost:4000/make-deliver?clientID=${clientID}&clientName=${clientName}`, entrega)
            if (response.status === 200) {
                await fetchDebtsClient(clientID)
                message.success("Entrega añadida correctamente!")
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
        }finally{
            hiddenMessage()
        }
    }

    const cancelAllDebts = async(values) =>{
        const hiddenMessage = message.loading("Cancelando fichero...",0)
        
        try {
            const response = await axios.post("http://localhost:4000/cancel-debts", values)
            if (response.status === 200) {
                setClientDebts([])
                setClientDelivers([])
                message.success("Deudas canceladas correctamente!")
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
        }finally{
            hiddenMessage()
        }
    }

    const fetchHistory = async (clientID) =>{
        setClientHistory([])
        const hiddenMessage = message.loading("Espere...")
        try {
            const response = await axios.get(`http://localhost:4000/get-history?clientID=${clientID}`)
            if (response.status === 200) {
                setClientHistory(response.data)
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
        }finally{
            hiddenMessage()
        }
    }   
    return (
        <AppContext.Provider
            value={{
                setActiveTab,activeTab,
                //Relacionado a clientes
                fetchClients,clients,fetchDebtsClient,clientDebts,clientDelivers, setClientDelivers,makeDeliver,clientData, setClientData,
                addDebts,uploadSuccess,
                cancelAllDebts,
                clientHistory, fetchHistory


            }}
        >
            {children}
        </AppContext.Provider>
    )
}