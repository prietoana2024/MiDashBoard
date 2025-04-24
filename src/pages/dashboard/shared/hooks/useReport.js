import { React, useState, useEffect, useMemo } from "react";
import IconBtn from "../../../../components/UI/Edit_DeleteBtn/IconBtn";
import StateLabel from "../StateLabel";
import TransactionDetailView from "../../transactions/components/TransactionDetail";
import reportService from "../../../../services/reportService";
import { errorCodes, handleHttpError } from "../../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import paypadService from "../../../../services/paypadService";


const useReport= (dateRange = null, selectedPaypad = null) => {
  const [reports, setReports] = useState([]);
  const [reportsTable, setReportsTable] = useState([]);
  const [modalElement, setModalElement] = useState(null);
  
  const [initialReports, setInitialReports] = useState([]);
  const element = useMemo(() => document.getElementById("reportsModal"));

  const moneyFormater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const buildTable = (newReports) => {
    if (!newReports) return;
    let table = [];
    newReports.forEach((item) => {
      // Format date safely with null check
      let formattedDate = "N/A";  // Default value
      if (item.dateCreated) {
        try {
          formattedDate = 
            item.dateCreated.split("T")[0] +
            " " +
            item.dateCreated.split("T")[1].substring(0, 8);
        } catch (error) {
          console.log("Error formatting date:", error);
          formattedDate = String(item.dateCreated);
        }
      } else if (item.datE_CREATED) {  // Check for alternate capitalization
        try {
          formattedDate = 
            item.datE_CREATED.split("T")[0] +
            " " +
            item.datE_CREATED.split("T")[1].substring(0, 8);
        } catch (error) {
          console.log("Error formatting date:", error);
          formattedDate = String(item.datE_CREATED);
        }
      }
      
      const tableItem = {
        id: item.id || item.ID || 0,
        ID: item.id || item.ID || 0,
        Referencia: item.reference || "N/A",
        Fecha: formattedDate,
        Total: moneyFormater.format(item.totalAmount || item.totaL_AMOUNT || 0),
        "Tipo de Documento": item.documenT_TYPE || item.documenttype || "N/A",
        Documento: item.document || "N/A",
        Nombres: item.name || "N/A",
        Apellidos: item.lastname || "N/A",
        Celular: item.phone || "N/A",
        Email: item.email || "N/A",
        Trámite: item.product || item.typeTransaction || "N/A",
        "Medio de pago": item.iD_TYPE_PAYMENT ? `Tipo ${item.iD_TYPE_PAYMENT}` : "N/A",
        Estado: <StateLabel value={item.stateReport || item.iD_STATE_TRANSACTION} />,
      };
      
      // Always add the action button - the ReportsTable component will decide whether to show it
      if(typeof element !== "undefined" && element !== null) {
        tableItem["Accion"] = (
          <IconBtn
            clickFunc={() => {
              const itemCopy = {...item};
              setModalElement(
                <TransactionDetailView
                  report={itemCopy}
                />
              );
            }}
            icon="fa-solid fa-glasses"
            tooltipText="Ver más"
          />
        );
      }
      table = table.concat(tableItem);
    });
    setReportsTable([...table]);
  };
  const getReportsOnePaypad = (internalSelectedPaypad, concatReports = false) => {
    reportService
      .getByIdPaypadAndDate({
        id: internalSelectedPaypad.id,
        from: dateRange.from,
        to: dateRange.to,
      })
      .then((data) => {
        console.log("Raw response data:", data);
  
        // Extraer datos del reporte
        let reportData=data;
        console.log("Processed report data:", reportData);
  
        if (reportData.length > 0) {
          if (concatReports) {
            setReports((state) => {
              const newReports = [...state, ...reportData];
              setInitialReports(newReports);
              return newReports;
            });
          } else {
            setReports(reportData);
          }
        } else {
          console.warn("No reports found in response");
          if (!concatReports) setReports([]);
        }
      })
      .catch(async (error) => {
        console.error("Error in getReportsOnePaypad:", error);
        const errorResponse = error && error.response ? error.response : error;
        let [errCode, errMsg] = await handleHttpError(errorResponse);
        if (errCode === errorCodes.notFound) {
          if (concatReports) return;
          errMsg = "No se encontró ninguna transacción";
          Swal.fire({
            text: errMsg,
            icon: "warning",
          });
          setReports([]);
          return;
        }
        Swal.fire({
          text: errMsg,
          icon: "error",
        });
        setReports([]);
      });
  };
  const refresh = async () => {
    if (dateRange === null || selectedPaypad === null) return;
    if(selectedPaypad.id == "all"){
      let paypads = await paypadService.getAll()
        .then(({ response }) => {
          return [...response];
        })
        .catch(async ({ response }) => {
          const [errCode, errMsg] = await handleHttpError(response);
          if (errCode !== errorCodes.notFound) {
            Swal.fire({
              text: errMsg,
              icon: "error",
            });
            return;
          }
          return [];
        });
      paypads.forEach(pp => getReportsOnePaypad(pp, true));
      return;
    }
    getReportsOnePaypad(selectedPaypad);
  };

  useEffect(() => {
    if (modalElement !== null && element !== null) {
      const modal = new Modal(element, {
        backdrop: "static",
      });
      modal.show();
    }
  }, [modalElement]);

  useEffect(() => {
    buildTable(reports);
  }, [reports]);

  return {reports, reportsTable, modalElement, setReports, refresh, initialReports};
};

export default useReport;