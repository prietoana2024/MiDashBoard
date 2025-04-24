import { useState, useEffect } from "react";
import paypadService from "../../../../services/paypadService";
import { errorCodes, handleHttpError } from "../../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import officeService from "../../../../services/officeService"; // Importamos el servicio de oficinas


const useSelectPayPad = (addAll = false, user = null) => {
  const [selectedPaypad, setSelectedPaypad] = useState(null);
  const [paypads, setPaypads] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let response;
        
        // Verificamos si el usuario existe y si es superadmin
        const isSuperAdmin = user?.rol === "superadmin"; // Ajusta según la estructura de tu objeto usuario
        
        if (user && !isSuperAdmin) {
          // Si el usuario no es superadmin, obtenemos solo sus oficinas usando el servicio
          response = await officeService.getByUser(user.id);
        } else {
          // Si es superadmin o no hay usuario especificado, usamos el servicio original
          const result = await paypadService.getAll();
          response = result.response;
        }
        
        if (addAll) {
          response.push({ id: "all", username: "Todos los Pay+" });
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

    if (paypads === null || paypads.length <= 0) {
      fetchData();
    }
  }, [user]);

  const handleChangePaypad = (value) => {
    setSelectedPaypad(() => {
      const paypadSelec = paypads.filter((p) => p.username == value.username)[0];
      return { ...paypadSelec };
    });
  };

  return { paypads, selectedPaypad, handleChangePaypad, setPaypads };
};

export default useSelectPayPad;