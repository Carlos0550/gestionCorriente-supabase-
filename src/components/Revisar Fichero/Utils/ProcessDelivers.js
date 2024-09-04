export const totalDelivers = (deliversData) => {
    return deliversData.reduce((total, item) => {
      return total + parseFloat(item.monto_entrega || 0); 
    }, 0);
  }
  