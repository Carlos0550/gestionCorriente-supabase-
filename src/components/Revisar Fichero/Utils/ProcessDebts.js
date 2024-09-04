import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { totalDelivers } from "./ProcessDelivers";

dayjs.extend(customParseFormat);
export const formatNames = (name) => {

    if (name) {
      const parts = name.trim().split(" ");
    const capitalizedParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join(" ");
    }
  };
export const summationProducts = (products) => {
    if (products) {
      let totalArs = 0;
    let totalUsd = 0;

    products.forEach(product => {
      if (product.change === "ars") {
        totalArs += product.quantity * product.price;
      } else {
        totalUsd += (product.quantity * product.price) * 1500;
      }
    });

    return (totalArs + totalUsd).toLocaleString("es-ES",{style: "currency", currency: "ARS"});
    }
  };

export const calculateSubtotal = (debtsData,dataDelivers) => {
  let total = 0;
  let totalUsd = 0;
  let totalArs = 0;
  const totalDeliveries = totalDelivers(dataDelivers)
  if (debtsData) {
    debtsData.forEach(element => {
      const change = element.change
      const price = element.price
      const quantity = element.quantity
      if (change === "usd") {
        totalUsd += (parseFloat(price) * parseInt(quantity)) * 1500
      }else if(change === "ars"){
        totalArs += parseFloat(price) * parseInt(quantity)
      }
    })
    total = (totalUsd + totalArs) - totalDeliveries
    return total
  }
  // return products.reduce((acc, product)=> {
  //   const price = parseFloat(product.price)
  //   const quantity = parseInt(product.quantity)
  //   return acc += price * quantity
  // },0)
}

export  const groupByDate = (clientDebts) => {
    if (clientDebts) {
      const grouped = {};
    clientDebts.forEach((element) => {
      const date = dayjs(element.buyDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      if (!grouped[date]) {
        grouped[date] = {
          buyDate: element.buyDate,
          estado: element.estado,
          vencimiento: element.duedate,
          products: [],
        };
      }

      grouped[date].products.push({
        idProduct: element.id,
        nombre_producto: element.nameProduct,
        price: parseFloat(element.price),
        change: element.change,
        quantity: element.quantity,
        
      });
    });
    return Object.values(grouped);
    }
  };