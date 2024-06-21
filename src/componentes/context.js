import React, { useContext, createContext, useState, useEffect } from "react";
import { supabase } from "../Auth/supabase";
import { useNavigate } from 'react-router-dom'
import { v4 } from "uuid";
import { message } from 'antd';


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


  const [invalidUser, setInvalidUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const loginAdmin = async (logValues) => {
    setLoading(true)
    try {

      const { data, error } = await supabase.auth.signInWithPassword({
        email: logValues.logemail,
        password: logValues.logpass,
      })
      if (data.user === null || data.session === null) {
        setInvalidUser(true)
        setTimeout(() => {
          setInvalidUser(false)
        }, 2000)
      } else {
        navigate("/home")
      }
      console.log("Data", data)
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000);
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
  const [isCreated, setIsCreated] = useState(false)
  const [isError, setIsError] = useState(false)
  const [userExist, setUserExist] = useState(false)
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
        setUserExist(true);
        console.log("dNI?", dataDni)
        setTimeout(() => {
          setUserExist(false);
        }, 1500);
        return; // Salir si el usuario ya existe por DNI
      }

      // Verificar si el usuario existe por nombre completo
      let { data: dataFullName, error: errorFullName } = await supabase
        .from('users')
        .select()
        .eq('nombre_completo', values.fullName);

      if (errorFullName) {
        throw errorFullName;
      }

      if (dataFullName.length > 0) {
        setUserExist(true);
        setTimeout(() => {
          setUserExist(false);
        }, 1500);
        return; // Salir si el usuario ya existe por nombre completo
      }

      // Insertar los datos del nuevo usuario
      const { error } = await supabase
        .from('users')
        .insert({
          "nombre_completo": values.fullName,
          "apellido": values.surname,
          "dni": values.dni,
          "telefono": values.phone,
          "direccion": values.street,
          "uuid": v4()
        });

      if (error) {
        throw error;
      } else {
        setIsCreated(true);
        setTimeout(() => {
          setIsCreated(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error en la consulta:', error);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 2000);
    } finally {
      setIsCreating(false);
    }
  };

  const [searching, setSearching] = useState(false)
  const [clientData, setClientData] = useState([])
  const [userNotExist, setUserNotExist] = useState(false)
  const findUser = async (values) => {
    setSearching(true)
    try {
      if (values.fullName && !values.dni) {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('nombre_completo', values.fullName)
        setSearching(false)
        if (data.length > 0) {
          setClientData(data)
        } else {
          setUserNotExist(true)
          setTimeout(() => {
            setUserNotExist(false)
          }, 1500);
        }
      }
      if (!values.fullName && values.dni) {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('dni', values.dni)
        setSearching(false)
        console.log(data)
      }

    } catch (error) {

    } finally {
      setSearching(false)
    }
  }

  const [userUUID, setUserUUID] = useState(null)
  useEffect(() => {
    clientData && clientData.forEach(element => {
      setUserUUID(element.uuid)
    })
  }, [clientData])


  const [isUpdating, setIsUpdating] = useState(false)
  const updateDataClient = async (values) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          "nombre_completo": values.nombre_completo || "",
          "apellido": values.apellido || "",
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
  const [debtError, setDebtError] = useState(false)
  const [debtSuccess, setDebtSuccess] = useState(false)
  const addDebt = async (values) => {
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
        setDebtError(true)
        setTimeout(() => {
          setDebtError(false)
        }, 2000);
      } else {
        setDebtSuccess(true)
        setTimeout(() => {
          setDebtSuccess(false)
          showDebtUser()
          fetchRegisterDeliverys()

        }, 1000);
      }
    } catch (error) {
      setDebtError(true)
      setTimeout(() => {
        setDebtError(false)
      }, 2000);
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
    }finally{
      setIsUpdatingProduct(false)
    }
  }

  const [isInserting, setIsInserting] = useState(false)
  const insertDebtTables = async (deliveryValues) => {
    console.log("InsertTables: ", deliveryValues)
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
      if (error) {
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


  return (
    <AppContext.Provider value={{
      loginAdmin, invalidUser, loading,
      closeSession, isClossing,
      createUser, isCreating, isCreated, isError, userExist,
      findUser, searching, clientData, userNotExist,
      updateDataClient, isUpdating,
      addDebt, addingDebt, debtError, debtSuccess,
      showDebtUser, fetchingData, DebtData, setDebtData,
      deleteProduct, isDeleting, userUUID,
      updateProduct,isUpdatingProduct,
      insertDebtTables, isInserting,
      fetchRegisterDeliverys, deliverData, fetchingDeliverys
    }}>
      {children}
    </AppContext.Provider>
  );
};