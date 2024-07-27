import { useState, useEffect } from 'react';
import { supabase } from '../../../Auth/supabase';
export const useFetchDebts = () => {
  const [debtUsers, setDebtsUsers] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [showRetryAlert, setShowRetryAlert] = useState(false);

  const fetchDataUsers = async () => {
    setFetchingData(true);
    setShowRetryAlert(false)
    try {
      const { data, error } = await supabase
        .from("debts")
        .select();

      if (error) {
        setShowRetryAlert(true);
        setTimeout(() => {
          setShowRetryAlert(false)
        }, 3500);
      } else if (data.length > 0) {
        setDebtsUsers(data);
      }
    } catch (error) {
      console.error("Server error:", error);
      setShowRetryAlert(true)
      setTimeout(() => {
        setShowRetryAlert(false)
      }, 3500);
    } finally {
      setFetchingData(false);

    }
  };

  useEffect(() => {
    fetchDataUsers();
  }, []);

  return { debtUsers, fetchingData, showRetryAlert, fetchDataUsers };
};
