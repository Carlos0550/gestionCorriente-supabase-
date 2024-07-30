const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return new Date(year, month - 1, day);
};

const filterOldDebts = (debtUsers) => {
  const today = new Date();
  return debtUsers.filter(user => {
    const buyDate = parseDate(user.buyDate);
    const timeDiff = today - buyDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24); // Convertir el tiempo en días
    return daysDiff >= 30;
  });
};

const getOldestDebt = (debts) => {
  return debts.reduce((oldest, current) => {
    const currentBuyDate = parseDate(current.buyDate);
    const oldestBuyDate = parseDate(oldest.buyDate);
    return currentBuyDate < oldestBuyDate ? current : oldest;
  });
};

const calculateDaysOverdue = (debt) => {
  const today = new Date();
  const buyDate = parseDate(debt.buyDate);
  const timeDiff = today - buyDate;
  return Math.floor(timeDiff / (1000 * 3600 * 24)); // Convertir el tiempo en días
};

export const filterAndGroupOldDebts = (debtUsers) => {
  // Filtrar los usuarios cuya fecha de compra sea mayor a 30 días
  const oldDebtUsers = filterOldDebts(debtUsers);

  // Agrupar deudas por cliente y obtener la más antigua
  const oldestDebtsByClient = Object.values(oldDebtUsers.reduce((acc, item) => {
    if (!acc[item.nombre_cliente]) {
      acc[item.nombre_cliente] = [];
    }
    acc[item.nombre_cliente].push(item);
    return acc;
  }, {})).map(getOldestDebt);

  // Obtener la lista final con nombre y días de atraso
  return oldestDebtsByClient.map(debt => ({
    nombre_cliente: debt.nombre_cliente,
    dias_vencido: calculateDaysOverdue(debt)
  }));
};