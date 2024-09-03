import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatNames = (name) => {
    const parts = name.trim().split(" ");
    const capitalizedParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
    return capitalizedParts.join(" ");
  };
export const summationProducts = (products) => {
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
  };

export  const groupByDate = (clientDebts) => {
    const grouped = {};

    clientDebts.forEach((element) => {
      const date = dayjs(element.buyDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      if (!grouped[date]) {
        grouped[date] = {
          buyDate: element.buyDate,
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
  };