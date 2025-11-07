import { useState, useEffect } from "react";
import paypadService from "../../../../services/paypadService";
import { errorCodes, handleHttpError } from "../../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import officeService from "../../../../services/officeService";

const useMultiSelectPayPad = (user = null) => {
  const [selectedPaypads, setSelectedPaypads] = useState([]);
  const [paypads, setPaypads] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let response;
        
        const isSuperAdmin = user?.rol === "superadmin";
        
        if (user && !isSuperAdmin) {
          response = await officeService.getByUser(user.id);
        } else {
          const result = await paypadService.getAll();
          response = result.response;
        }
        
        setPaypads([...response]);
      } catch (error) {
        if (error.response) {
          const [errCode, errMsg] = await handleHttpError(error.response);
          if (errCode !== errorCodes.notFound) {
            Swal.fire({
              text: errMsg,
              icon: "error",
            });
          }
        } else {
          console.error("Error fetching paypads:", error);
          Swal.fire({
            text: "Error al obtener los dispositivos de pago",
            icon: "error",
          });
        }
        setPaypads([]);
      }
    }

    if (paypads.length === 0) {
      fetchData();
    }
  }, [user]);

  const handleChangePaypads = (e) => {
    setSelectedPaypads(e.value || []);
  };

  // Retorna string "1,2,3"
  const getPaypadIdsString = () => {
    if (!selectedPaypads || selectedPaypads.length === 0) return "";
    return selectedPaypads.map(p => p.id).join(",");
  };

  // Retorna array [1, 2, 3]
  const getPaypadIdsArray = () => {
    if (!selectedPaypads || selectedPaypads.length === 0) return [];
    return selectedPaypads.map(p => p.id);
  };

  // Retorna string con nombres "PayPad1, PayPad2"
  const getPaypadNamesString = () => {
    if (!selectedPaypads || selectedPaypads.length === 0) return "";
    return selectedPaypads.map(p => p.username).join(", ");
  };

  // Limpia la selección
  const clearSelection = () => {
    setSelectedPaypads([]);
  };

  return { 
    paypads, 
    selectedPaypads, 
    handleChangePaypads, 
    getPaypadIdsString,
    getPaypadIdsArray,
    getPaypadNamesString,
    clearSelection,
    setPaypads
  };
};

export default useMultiSelectPayPad;