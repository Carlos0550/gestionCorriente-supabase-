export const filterExpiredDebts = (data) => {
    const currentDate = new Date();
    return data.map(item => {
      const [day, month, year] = item.buyDate.split('-').map(Number);
      const buyDate = new Date(year, month - 1, day);
      const diffTime = Math.abs(currentDate - buyDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...item, deudaVencida: diffDays > 30, diffDays };
    });
  };
  
  export const groupByClient = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.nombre_cliente]) {
        acc[item.nombre_cliente] = [];
      }
      acc[item.nombre_cliente].push(item);
      return acc;
    }, {});
  };
  