import React, { useContext, createContext, useState, useEffect } from "react";
import { supabase } from "../Auth/supabase";
import { useNavigate } from 'react-router-dom'
import { v4 } from "uuid";
import { message } from 'antd';
import Item from "antd/es/list/Item";
import Networck from "./Network/Networck";


export const AppContext = createContext();



export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return ctx;
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate()
  
  const [progress, setProgress] = useState(0)

  const activateLoader = () => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 10
      })

      return () => {
        clearInterval(timer)
      }
    }, 1000);
  }


  const [invalidUser, setInvalidUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const loginAdmin = async (logValues) => {
    setLoading(true)
    activateLoader()
    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email: logValues.logemail,
        password: logValues.logpass,
      })
      if (data.user === null || data.session === null) {
        setInvalidUser(true)
        setTimeout(() => {
          setInvalidUser(false)
        }, 3000)
      } else {
        navigate("/home")
      }
      console.log("Data", data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const [isClossing, setIsClossing] = useState(false)
  const closeSession = async () => {
    setIsClossing(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.log(error)
      }
      setIsClossing(false)
      navigate("/")
    } catch (error) {
      console.log(error)
    } finally {
      setIsClossing(false)
    }
  }
  const [isCreating, setIsCreating] = useState(false)
  const createUser = async (values) => {
    setIsCreating(true);
    try {
      // Verificar si el usuario existe por DNI
      let { data: dataDni, error: errorDni } = await supabase
        .from('users')
        .select()
        .eq('dni', values.dni);

      if (errorDni) {
        throw errorDni;
      }

      if (dataDni.length > 0) {
        message.error("Ya existe un usuario con ese DNI")

        return;
      }

      //verificar por nombre
      let { data: dataFullName, error: errorFullName } = await supabase
        .from('users')
        .select()
        .eq('nombre_completo', values.fullName.toLowerCase());

      if (errorFullName) {
        throw errorFullName;
      }

      if (dataFullName.length > 0) {
        message.error("Ya existe un usuario con ese nombre")
        return; 
      }

      //verificar por apellido
      let { data: dataSurname, error: errorSurname } = await supabase
      .from('users')
      .select()
      .eq('nombre_completo', values.fullName.toLowerCase());

      if (errorSurname) {
        throw errorSurname;
      }

      if (dataSurname.length > 0) {
        message.error("Ya existe un usuario con ese apellido")
        return; 
      }

      const { error } = await supabase
        .from('users')
        .insert({
          "nombre_completo": values.fullName.toLowerCase(),
          "apellido": values.surname.toLowerCase(),
          "dni": values.dni,
          "telefono": values.phone,
          "direccion": values.street,
          "uuid": v4()
        });

      if (error) {
        message.error("Error al crear el usuario, por favor intente nuevamente")

        throw error;

      } else {
        message.success("Usuario creado con exito")
      }
    } catch (error) {
      message.error("Error al crear el usuario, por favor intente nuevamente")
    } finally {
      setIsCreating(false);
    }
  };

  const [searching, setSearching] = useState(false)
  const [userNotExist, setUserNotExist] = useState(false)
  const [clientData, setClientData] = useState([])

  const findUser = async (values) => {
    setSearching(true)
    try {
      if (values.fullName && !values.dni) {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('nombre_completo', values.fullName.toLowerCase())
        setSearching(false)
        if (data.length > 0) {
          setClientData(data)
        } else {
          message.error("No existe un cliente con esos datos")
          message.info("¡Intentó con el nombre completo? (sin apellido)")
          setUserNotExist(true)
          setTimeout(() => {
            setUserNotExist(false)
          }, 3000)
        }
      }
      if (!values.fullName && values.dni) {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('dni', values.dni)
        setSearching(false)
        if (data.length > 0) {
          setClientData(data)

        } else {
          message.error("No existe un cliente con esos datos")
          setUserNotExist(true)
          setTimeout(() => {
            setUserNotExist(false)
          }, 3000)
        }
      }

      if (values.apellido) {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('apellido', values.apellido.toLowerCase())
        setSearching(false)
        if (data.length > 0) {
          setClientData(data)

        } else {
          message.error("No existe un cliente con esos datos")
          setUserNotExist(true)
          setTimeout(() => {
            setUserNotExist(false)
          }, 3000)
        }
      }

    } catch (error) {
      message.error("Hubo un error, por favor intente nuevamente")
    } finally {
      setSearching(false)
    }
  }

  const [userUUID, setUserUUID] = useState(null)
  useEffect(() => {
    if (Array.isArray(clientData)) {
      clientData && clientData.forEach(element => {
        setUserUUID(element.uuid)
      })
    }
  }, [clientData])


  const [isUpdating, setIsUpdating] = useState(false)
  const updateDataClient = async (values) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          "nombre_completo": values.nombre_completo.toLowerCase() || "",
          "apellido": values.apellido.toLowerCase() || "",
          "dni": values.dni || "",
          "telefono": values.telefono || "",
          "direccion": values.direccion || ""
        })
        .eq('uuid', values.uuid)
      setIsUpdating(false)
      if (error) {
        message.error("Hubo un error al actualizar, reintente nuevamente")
      } else {
        message.success("Usuario actualizado, por favor cierre esta ventana")
        message.info("Esta página se actualizará en 3 segundos...")
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      }
    } catch (error) {
      console.log(error)
      message.error("Hubo un error al actualizar, reintente nuevamente")

    } finally {
      setIsUpdating(false)
    }
  }
  const [addingDebt, setIsAddingDebt] = useState(false)

  const addDebt = async (values) => {
    message.loading("Añadiendo producto...")
    setIsAddingDebt(true)
    try {
      const { error } = await supabase
        .from('debts')
        .insert({
          "nombre_cliente": values.nombre_cliente,
          "apellido_cliente": values.apellido_cliente,

          "buyDate": values.buyDate,
          "nameProduct": values.nameProduct,
          "quantity": values.quantity,
          "price": values.price,
          "change": values.change,
          "uuid": values.uuid
        })
      if (error) {
        console.log(error)
        message.error("Error al añadir la deuda, por favor intente nuevamente")
      } else {
        message.success("Producto añadido correctamente!")
        setTimeout(() => {
          showDebtUser()
          fetchRegisterDeliverys()

        }, 1000);
      }
    } catch (error) {
      message.error("Error al añadir la deuda, por favor intente nuevamente")

    } finally {
      setIsAddingDebt()

    }
  }
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [DebtData, setDebtData] = useState([]);

  const deleteProduct = async (debtId) => {
    setIsDeleting(true);
    try {
      const { data, error } = await supabase
        .from('debts')
        .delete()
        .eq('debtIid', debtId)
        .eq('uuid', userUUID);

      if (error) {
        throw error;
      }

      if (data) {
        message.success('Producto eliminado exitosamente');
        showDebtUser();
        fetchRegisterDeliverys()
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      message.error('Error al eliminar el producto');
    } finally {
      setIsDeleting(false);
    }
  };

  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)
  const updateProduct = async (values) => {
    setIsUpdatingProduct(true)
    try {
      const { error } = await supabase
        .from('debts')
        .update({
          "nameProduct": values.nameProduct,
          "quantity": values.quantity,
          "price": values.price,
          "change": values.change
        })
        .eq('id', values.id)
      if (!error) {
        message.success("Actualizacion exitosa")
        showDebtUser()
        fetchRegisterDeliverys()
        showDebtUser()
        setIsUpdatingProduct(false)

      }
    } catch (error) {
      console.log(error)
      message.error("Error, intente de nuevo!")
    } finally {
      setIsUpdatingProduct(false)
    }
  }

  const [isInserting, setIsInserting] = useState(false)
  const insertDebtTables = async (deliveryValues) => {
    setIsInserting(true)
    try {
      const { error: DB_1 } = await supabase
        .from('registerDelierys')
        .insert({
          "nombre_cliente": deliveryValues.nombre_cliente,
          "apellido_cliente": deliveryValues.apellido,
          "uuid_cliente": deliveryValues.uuid_cliente,
          "fecha_entrega": deliveryValues.fecha_entrega,
          "monto_entrega": deliveryValues.monto_entrega,

        })
      if (!DB_1) {
        message.success("Entrega guardada con exito")
        setIsInserting(false)
        fetchRegisterDeliverys()

      }

    } catch (error) {
      console.log(error)
      message.error("Ocurrió un problema, por favor reintente nuevamente")
    } finally {
      setIsInserting(false)
    }
  }

  const [fetchingDeliverys, setFetchingDelierys] = useState(false)
  const [deliverData, setDeliverData] = useState([]);
  const fetchRegisterDeliverys = async () => {
    setFetchingDelierys(true)
    try {
      const { data, error } = await supabase
        .from('registerDelierys')
        .select()
        .eq("uuid_cliente", userUUID)
      if (error) {
        console.log(error)
        message.error("Hubo un error al mostrar el registro, reintente nuevamente!")
      }
      if (data.length > 0) {
        setDeliverData(data)
        setFetchingDelierys(false)
      }
    } catch (error) {
      console.log(error)
      message.error("Hubo un error al mostrar el registro, reintente nuevamente!")

    } finally {
      setFetchingDelierys(false)
    }
  }

  const showDebtUser = async () => {
    setFetchingData(true);
    try {
      const { data, error } = await supabase
        .from('debts')
        .select()
        .eq("uuid", userUUID);

      if (error) {
        throw error;
      }

      if (data) {
        setDebtData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingData(false);
    }
  };

  const [debts, setDebts] = useState([]);
  const [registers, setRegisters] = useState([]);

  const cancelDebt = async () => {
    message.loading("Aguarde...");
    try {
      const { data: registerData, error: registerError } = await supabase
        .from("registerDelierys") // Asegúrate del nombre correcto
        .select()
        .eq("uuid_cliente", userUUID);
  
      if (registerError) {
        console.log(registerError);
        throw registerError;
      }
  
      const { data: debtsData, error: debtsError } = await supabase
        .from("debts")
        .select()
        .eq("uuid", userUUID);
  
      if (debtsError) {
        console.log(debtsError);
        throw debtsError;
      }
  
      setRegisters(registerData);
      setDebts(debtsData);
  
      if (debtsData.length > 0 && registerData.length > 0) { // Validación
        const actuallyDate = new Date().toISOString().split("T")[0];
        const fullName = `${registerData[0].nombre_cliente} ${registerData[0].apellido_cliente}`;
        
        const insertData = debtsData.map(item => ({
          "nombre_completo": fullName,
          "fecha_cancelacion": actuallyDate,
          "nombre_producto": item.nameProduct,
          "precio_producto": item.price || "",
          "quantity": item.quantity || 1,
          "moneda": item.change || "",
          "fecha_compra": item.buyDate || "",
          "userId": userUUID
        }));
  
        const { error: insertError } = await supabase
          .from("userHistory")
          .insert(insertData);
  
        if (insertError) {
          console.log(insertError);
          throw insertError;
        }
  
        const { error: deleteRegisterError } = await supabase
          .from("registerDelierys")
          .delete()
          .eq("uuid_cliente", userUUID);
  
        if (deleteRegisterError) {
          throw deleteRegisterError;
        }
  
        const { error: deleteDebtsError } = await supabase
          .from("debts")
          .delete()
          .eq("uuid", userUUID);
  
        if (deleteDebtsError) {
          throw deleteDebtsError;
        }
  
        message.success("Fichero cancelado");
        setDebtData([]);
        setDeliverData([]);
        showDebtUser();
        fetchRegisterDeliverys();
      } else {
        message.error("No se encontraron registros o deudas para cancelar.");
      }
  
    } catch (error) {
      console.error("Error cancelando deuda:", error);
      message.error("Error cancelando deuda");
    }
  };
  

  useEffect(()=>{
    console.log(debts)
    console.log(registers)
  },[debts, registers])

  const [clientHistory, setClientHistory] = useState([])
  const fetchHistoryClient = async() =>{
    message.loading("Trayendo historial...")
    try {
      const {data,error} = await supabase
      .from("userHistory")
      .select()
      .eq("userId", userUUID)

      if (error) {
        message.error("Ocurrió un error al mostrar el historial del cliente")
        console.error(error)
        throw error
      }
      console.log(data)
      setClientHistory(data)
    } catch (error) {
      message.error("Ocurrió un error al mostrar el historial del cliente")
    }
  }

const isOnlime = Networck();

if (!isOnlime) {
  message.info("Verifique su conexión a internet")
}
  

  return (
    <AppContext.Provider value={{
      loginAdmin, invalidUser, loading,
      closeSession, isClossing,
      createUser, isCreating,
      findUser, searching, clientData, setClientData, userNotExist,
      updateDataClient, isUpdating,
      addDebt, addingDebt,
      showDebtUser, fetchingData, DebtData, setDebtData,
      deleteProduct, isDeleting, userUUID,
      updateProduct, isUpdatingProduct,
      insertDebtTables, isInserting,
      fetchRegisterDeliverys, deliverData, fetchingDeliverys,
      cancelDebt,
      fetchHistoryClient, clientHistory,

      activateLoader, progress
    }}>
      {children}
    </AppContext.Provider>
  );
};