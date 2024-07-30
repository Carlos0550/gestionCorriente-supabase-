import React, { useContext, createContext, useState, useEffect, useRef } from "react";
import { supabase } from "../Auth/supabase";
import { useNavigate } from 'react-router-dom'
import { v4 } from "uuid";
import { message } from 'antd';
import Item from "antd/es/list/Item";
import Networck from "./Network/Networck";
import Swal from "sweetalert2";


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
  const [selectedOption, setSelectedOption] = useState('añadirDeuda');





  const date = new Date();

  let año = date.getFullYear()
  let mes = date.getMonth() + 1
  let dia = date.getDate()

  const fullDate = `${dia}-${mes}-${año}`
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
  const [isVerifying, setIsVerifying] = useState(true);

  const alreadyShownToken = useRef(false);

  useEffect(() => {
    const validateSessionToken = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!data.session.access_token) {
          if (!alreadyShownToken.current) {
            message.info("Sesión expirada", 5);
            alreadyShownToken.current = true;
          }
          closeSession();
          setIsVerifying(false); // Detener la verificación
        } else {
          // Si hay token, reiniciar la verificación si estaba detenida
          setIsVerifying(true);
        }
      } catch (error) {
        console.error("Error al validar la sesión:", error);
        if (!alreadyShownToken.current) {
          message.info("Sesión expirada", 5);
          alreadyShownToken.current = true;
        }
        closeSession();
        setIsVerifying(false); // Detener la verificación
      }
    };

    let interval;
    if (isVerifying) {
      interval = setInterval(validateSessionToken, 5000);
    }

    // Ejecutar la validación inicial
    validateSessionToken();

    return () => clearInterval(interval);
  }, [isVerifying]);

  const [isCreating, setIsCreating] = useState(false)
  const [userExists, setUserNotExists] = useState(false)
  const createUser = async (values) => {
    setIsCreating(true);
    try {
      // Verificar si el usuario existe por DNI
      let { data: dataDni, error: errorDni } = await supabase
        .from('users')
        .select()
        .eq('dni', values.dni || 0);

      if (errorDni) {
        throw errorDni;
      }

      if (dataDni.length > 0) {
        message.error("Ya existe un usuario con ese DNI")
        console.log(dataDni)
        setUserNotExists(true)
        setTimeout(() => {
          setUserNotExists(false)
        }, 3500);
        return;
      }

      const { error } = await supabase
        .from('users')
        .insert({
          "nombre_completo": values.fullName.toLowerCase(),
          "apodo": values.apodo || "",
          "dni": values.dni || "",
          "telefono": values.phone || "",
          "direccion": values.street || "",
          "uuid": v4()
        });

      if (error) {
        message.error("Ocurrió un error, verifique su conexión e intente nuevamente")
        console.log(error)

      } else {
        message.success("Usuario creado con exito")
      }
      let nombre_completo = values.fullName
      let nombreMinuscula = nombre_completo.toLowerCase()
      console.log(nombreMinuscula)
      await findUser({
        fullName: nombreMinuscula
      })

    } catch (error) {
      message.error("Ocurrió un error, verifique su conexión e intente nuevamente")
      console.log(error)
    } finally {
      setIsCreating(false);
    }
  };

  const [searching, setSearching] = useState(false)
  const [userNotExist, setUserNotExist] = useState(false)
  const [clientData, setClientData] = useState([])
  const [DebtData, setDebtData] = useState([]);
  const [deliverData, setDeliverData] = useState([]);

  const findUser = async (values) => {
    setSearching(true);
    setDebtData([])
    setDeliverData([])
    setClientData([])
    setUserUUID(null)
    setClientHistory([])

    try {
      let data, error;

      if (values.fullName && !values.dni) {
        const normalizedFullName = `%${values.fullName.trim().toLowerCase()}%`;
        ({ data, error } = await supabase
          .from('users')
          .select()
          .ilike('nombre_completo', normalizedFullName));
      } else if (!values.fullName && values.dni) {
        ({ data, error } = await supabase
          .from('users')
          .select()
          .eq('dni', values.dni));
      }else if(values.uuid){
        message.info("Buscando por el uuid",2)
        ({ data, error } = await supabase
          .from('users')
          .select()
          .eq('uuid', values.uuid));
      } else {
        throw new Error("Debes proporcionar un nombre completo o un DNI.");
      }

      if (error) {
        throw new Error(error.message);
      }

      if (data.length > 0) {
        setClientData(data);
        setDebtData([]);
        setDeliverData([]);
        message.success("Cliente encontrado")
      } else {
        message.error("No existe un cliente con esos datos");
        setUserNotExist(true);
        setTimeout(() => {
          setUserNotExist(false);
        }, 8000);
      }
    } catch (error) {
      message.error("Hubo un error, por favor intente nuevamente");
      console.log(error);
    } finally {
      setSearching(false);
    }
  };


  const [userUUID, setUserUUID] = useState(null)
  useEffect(() => {
    if (clientData) {
      clientData.forEach(el => {
        setUserUUID(el.uuid)
      })
    }
  }, [clientData])


  const [isUpdating, setIsUpdating] = useState(false)
  const updateDataClient = async (values) => {
    setIsUpdating(true)
    const hiddenMessage = message.loading("Aguarde...", 0)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          "nombre_completo": values.nombre_completo.toLowerCase() || "",
          "dni": values.dni || "",
          "apodo": values.apodo || "",
          "telefono": values.telefono || "",
          "direccion": values.direccion || ""
        })
        .eq('uuid', values.uuid)
      setIsUpdating(false)
      if (error) {
        hiddenMessage()
        message.error("Hubo un error al actualizar, reintente nuevamente")
      } else {
        hiddenMessage()
        message.success("Datos actualizados correctamente")
        await findUser({
          fullName: values.nombre_completo
        })
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
    setIsAddingDebt(true)
    try {
      const { error } = await supabase
        .from('debts')
        .insert({
          "nombre_cliente": values.nombre_cliente,
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
          "buyDate": values.date,
          "change": values.change
        })
        .eq('id', values.id)
      if (!error) {
        message.success("Actualizacion exitosa")
        showDebtUser()
        fetchRegisterDeliverys()
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
      } else {
        setDeliverData([])

      }
    } catch (error) {
      console.log(error)
      message.error("Hubo un error al mostrar el registro, reintente nuevamente!")

    } finally {
      setFetchingDelierys(false)
    }
  }

  const [isUpdatingDeliver, setIsUpdatingDeliver] = useState(false)
  const [isSendingUpdatingDeliver, setIsSendingUpdatingDeliver] = useState(false)
  const updateDeliver = async (values) => {
    setIsSendingUpdatingDeliver(true)
    try {
      const { error } = await supabase
        .from('registerDelierys')
        .update({
          'monto_entrega': values.monto_entrega
        })
        .eq("id", values.idDebt)

      if (error) {
        message.error("Ocurrio un error al actualizar la entrega, por favor intente nuevamente")
        console.log(error)
      }
      setIsSendingUpdatingDeliver(false)
      showDebtUser();
      fetchRegisterDeliverys();

    } catch (error) {
      console.log(error)
    } finally {
      setIsSendingUpdatingDeliver(false)
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

  const deleteDelivery = async (val) => {
    console.log(val);
    Swal.fire({
      title: "Eliminar esta entrega?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"
    }).then(async (result) => {  // Asegúrate de usar async aquí
      if (result.isConfirmed) {
        const hideMessage = message.loading("Aguarde...", 0);

        try {
          const { error } = await supabase  // Asegúrate de esperar esta operación
            .from("registerDelierys")
            .delete()
            .eq('id', val);

          if (!error) {
            hideMessage()
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: false,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Entrega eliminada correctamente"
            });
            fetchRegisterDeliverys()

          } else {
            throw new Error("Hubo un error al procesar la solicitud");
          }
        } catch (error) {
          hideMessage()
          console.error(error);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: "Hubo un error al procesar la solicitud"
          });
        }
      }
    });
  }


  const MAX_RETRIES = 3; // Número máximo de reintentos

const retryOperation = async (operation, args, maxRetries) => {
  let attempts = 0; // Contador de intentos
  let error;
  while (attempts < maxRetries) {
    try {
      return await operation(...args); // Intentar ejecutar la operación
    } catch (err) {
      error = err; // Guardar el error
      attempts++;
      if (attempts >= maxRetries) {
        throw error;
      }
    }
  }
};

const deleteRegisterDelierys = async (userUUID) => {
  const { error } = await supabase
    .from("registerDelierys")
    .delete()
    .eq("uuid_cliente", userUUID);
  if (error) throw error;
};

const deleteDebts = async (userUUID) => {
  const { error } = await supabase
    .from("debts")
    .delete()
    .eq("uuid", userUUID);
  if (error) throw error;
};

const cancelDebt = async () => {
  const hideMessage = message.loading("Cancelando fichero, aguarde...", 0);
  try {
    const { data: registerData, error: registerError } = await supabase
      .from("registerDelierys")
      .select()
      .eq("uuid_cliente", userUUID);

    if (registerError) {
      console.log(registerError);
      hideMessage();
      message.error("Hubo un error al procesar la solicitud, por favor intente nuevamente");
      throw registerError;
    }

    const { data: debtsData, error: debtsError } = await supabase
      .from("debts")
      .select()
      .eq("uuid", userUUID);

    if (debtsError) {
      console.log(debtsError);
      hideMessage();
      message.error("Hubo un error al procesar la solicitud, por favor intente nuevamente");
      throw debtsError;
    }

    setRegisters(registerData);
    setDebts(debtsData);

    if (debtsData.length > 0 && registerData.length > 0) {
      const fullName = `${registerData[0].nombre_cliente} ${registerData[0].apellido_cliente}`;

      const insertData = debtsData.map(item => ({
        "nombre_completo": fullName,
        "fecha_cancelacion": fullDate,
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
        hideMessage();
        message.error("Hubo un error al procesar la solicitud, por favor intente nuevamente");
        throw insertError;
      }

      await retryOperation(deleteRegisterDelierys, [userUUID], MAX_RETRIES);
      await retryOperation(deleteDebts, [userUUID], MAX_RETRIES);

      hideMessage();
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
  } finally {
    hideMessage();
  }
};



  // useEffect(()=>{
  //   console.log(debts)
  //   console.log(registers)
  // },[debts, registers])

  const [clientHistory, setClientHistory] = useState([])
  const [fetchingHistory, setFetchingHistory] = useState(false)
  const fetchHistoryClient = async () => {
    setFetchingHistory(true)
    try {
      const { data, error } = await supabase
        .from("userHistory")
        .select()
        .eq("userId", userUUID)

      if (error) {
        message.error("Ocurrió un error al mostrar el historial del cliente")
        console.error(error)
        throw error
      }

      setClientHistory(data)
      setFetchingHistory(false)
    } catch (error) {
      message.error("Ocurrió un error al mostrar el historial del cliente")
    } finally {
      setFetchingHistory(false)
    }
  }

  const [usdPrice, setUsdPrice] = useState([])
  useEffect(() => {
    const handleFetchUsd = async () => {
      const { data, error } = await supabase
        .from('usdPrice')
        .select()
        .eq('id', 1)

      if (data) {
        setUsdPrice(data)
      }
    }
    handleFetchUsd()

  
  }, [navigate, clientData, userUUID])

  const deleteUser = async () => {
    const hideMessage = message.loading("Eliminando cliente", 0);
  
    const deleteFromTable = async (table, column, value) => {
      const response = await supabase
        .from(table)
        .delete()
        .eq(column, value);
      return response;
    };
  
    try {
      const [responseDebts, responseDeliveries, responseHistory, responseUsers] = await Promise.all([
        deleteFromTable('debts', 'uuid', userUUID),
        deleteFromTable('registerDelierys', 'uuid_cliente', userUUID),
        deleteFromTable('userHistory', 'userId', userUUID),
        deleteFromTable('users', 'uuid', userUUID),
      ]);
  
      const responses = [responseDebts, responseDeliveries, responseHistory, responseUsers];
      console.log(responses)
      const allSuccessful = responses.every(response => response.status === 204);
  
      if (allSuccessful) {
        message.success("Usuario eliminado, no hubo errores");
        message.info("Refrescando página en 3...",3)
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      } else {
        const errors = responses.filter(response => response.status !== 204);
        throw new Error(`Error al eliminar en las siguientes tablas: ${errors.map(e => e.table).join(', ')}`);
      }
    } catch (error) {
      message.error(`Error al eliminar el usuario: ${error.message}`);
    } finally {
      hideMessage();
    }
  };
  

    const isOnlime = Networck();
    const alreadyShown = useRef(false)
    if (!isOnlime && !alreadyShown.current) {
      message.info("La conexión a internet se perdió", 10)
      alreadyShown.current = true
      if (isOnlime) {
        message.success("La conexión a internet ha vuelto!")
      }
    }

    return (
      <AppContext.Provider value={{
        loginAdmin, invalidUser, loading,
        closeSession, isClossing,
        createUser, isCreating, userExists,
        findUser, searching, clientData, setClientData, userNotExist,
        updateDataClient, isUpdating,
        addDebt, addingDebt,
        showDebtUser, fetchingData, DebtData, setDebtData,
        deleteProduct, isDeleting, userUUID,
        updateProduct, isUpdatingProduct,
        insertDebtTables, isInserting, setIsUpdatingDeliver, isUpdatingDeliver, updateDeliver, isSendingUpdatingDeliver,
        fetchRegisterDeliverys, deliverData, fetchingDeliverys,
        cancelDebt, deleteDelivery,
        fetchHistoryClient, clientHistory, fetchingHistory,
        usdPrice, setUsdPrice,
        setSelectedOption, selectedOption,
        activateLoader, progress, fullDate,
        deleteUser
      }}>
        {children}
      </AppContext.Provider>
    );
  };