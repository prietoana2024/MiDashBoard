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
      const tableItem = {
        id: item.id,
        ID: item.id,
        Trámite: item.typeTransaction,
        "Referencia cliente": item.reference,
        Documento: item.document,
        Fecha:
          item.dateCreated.split("T")[0] +
          " " +
          item.dateCreated.split("T")[1].substring(0, 8),
        Total: moneyFormater.format(item.totalAmount),
        "Total sin redondear": moneyFormater.format(item.realAmount),
        Ingresado: moneyFormater.format(item.incomeAmount),
        Devuelto: moneyFormater.format(item.returnAmount),
        "Medio de pago": item.typePayment,
        Estado: <StateLabel value={item.stateReport} />,
      };
      if(element !== null) {
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
    reportService.getByIdPaypadAndDate({
      id: internalSelectedPaypad.id,
      from: dateRange.from,
      to: dateRange.to,
    }).then(({ response }) => {
      if(concatReports) setReports((state) => {
        setInitialReports(state.concat([...response]));
        return state.concat([...response]);});
      else setReports([...response]);
    }).catch(async ({ response }) => {
      let [errCode, errMsg] = await handleHttpError(response);
      if (errCode === errorCodes.notFound) {
        if(concatReports) return;
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