/*import { React, useState, useEffect, useMemo } from "react";
import IconBtn from "../../../../components/UI/Edit_DeleteBtn/IconBtn";
import StateLabel from "../StateLabel";
import TransactionDetailView from "../../transactions/components/TransactionDetail";
import reportService from "../../../../services/reportService";
import { errorCodes, handleHttpError } from "../../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import paypadService from "../../../../services/paypadService";

const useReport = (dateRange = null, selectedPaypad = null) => {
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

    function getProperty(item, propNames, defaultValue = "N/A") {
      for (const prop of propNames) {
        if (item[prop] !== undefined && item[prop] !== null) {
          return item[prop];
        }
      }
      return defaultValue;
    }

    newReports.forEach((item) => {
      let formattedDate = "N/A";
      const dateCreated = getProperty(item, ["dateCreated", "datE_CREATED", "DATE_CREATED"]);

      if (dateCreated && dateCreated !== "N/A") {
        try {
          formattedDate =
            dateCreated.split("T")[0] +
            " " +
            dateCreated.split("T")[1].substring(0, 8);
        } catch (error) {
          console.log("Error formatting date:", error);
          formattedDate = String(dateCreated);
        }
      }
      const tableItem = {
        id: getProperty(item, ["id", "ID"], 0),
        ID: getProperty(item, ["id", "ID"], 0),
        Referencia: getProperty(item, ["referencia", "REFERENCIA", "Referencia"]),
        Fecha: formattedDate,
        Total: moneyFormater.format(getProperty(item, ["totalAmount", "totaL_AMOUNT", "TOTAL_AMOUNT", "total"], 0)),
        "Tipo de Documento": getProperty(item, ["documenttype", "documenT_TYPE", "DOCUMENT_TYPE"]),
        Documento: getProperty(item, ["document", "DOCUMENT", "Document"]),
        Nombres: getProperty(item, ["name", "NAME", "Name"]),
        Apellidos: getProperty(item, ["lastName", "lastname", "LASTNAME", "LastName"]),
        Celular: getProperty(item, ["phone", "PHONE", "Phone"]),
        Email: getProperty(item, ["email", "EMAIL", "Email"]),
        Trámite: getProperty(item, ["product", "PRODUCT"]),
        Tipo: (() => {
          const paymentType = getProperty(item, ["paymentType", "iD_TYPE_PAYMENT", "paymenttype"]);
          return paymentType === 1 ? "Efectivo" : paymentType === 2 ? "Tarjeta" : "Desconocido";
        })(),
        Estado: (
          <StateLabel
            value={() => {
              const state = getProperty(item, ["stateReport", "STATE", "state", "iD_STATE_TRANSACTION", "ID_STATE_TRANSACTION"]);
              return state === 1
                ? "Iniciada"
                : state === 2
                  ? "Aprobada"
                  : state === 3
                    ? "Cancelada"
                    : state === 4
                      ? "Aprobada Error Devuelta"
                      : state === 5
                        ? "Cancelada Error Devuelta"
                        : state === 6
                          ? "Aprobada Sin Notificar"
                          : state === 7
                            ? "Error Servicio de Tercero"
                            : "Desconocido";
            }}
          />
        ),
      };
      if (typeof element !== "undefined" && element !== null) {
        tableItem["Accion"] = (
          <IconBtn
            clickFunc={() => {
              const itemCopy = { ...item };
              setModalElement(<TransactionDetailView report={itemCopy} />);
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
        let reportData = data;
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
            setInitialReports(reportData);
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

  const getReportsOnePaypadProduct = (internalSelectedPaypad, selectedProduct, concatReports = false) => {
    reportService
      .getByIdPaypadAndDateProduct({
        id: internalSelectedPaypad.id,
        from: dateRange.from,
        to: dateRange.to,
        product: selectedProduct,
      })
      .then((data) => {
        console.log("Raw response data:", data);
        let reportData = data;
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
            setInitialReports(reportData);
          }
        } else {
          console.warn("No reports found in response");
          if (!concatReports) setReports([]);
        }
      })
      .catch(async (error) => {
        console.error("Error in getReportsOnePaypadProduct:", error);
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
    if (selectedPaypad.id === "all") {
      let paypads = await paypadService
        .getAll()
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
      paypads.forEach((pp) => getReportsOnePaypad(pp, true));
      return;
    }
    getReportsOnePaypad(selectedPaypad);
  };

  const refreshProduct = async (selectedProduct) => {
    if (dateRange === null || selectedPaypad === null || !selectedProduct) return;
    if (selectedPaypad.id === "all") {
      let paypads = await paypadService
        .getAll()
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
      paypads.forEach((pp) => getReportsOnePaypadProduct(pp, selectedProduct, true));
      return;
    }
    getReportsOnePaypadProduct(selectedPaypad, selectedProduct);
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

  return { reports, reportsTable, modalElement, setReports, refresh, initialReports, refreshProduct };
};

export default useReport;*/

import { React, useState, useEffect, useMemo } from "react";
import IconBtn from "../../../../components/UI/Edit_DeleteBtn/IconBtn";
import StateLabel from "../StateLabel";
import TransactionDetailView from "../../transactions/components/TransactionDetail";
import reportService from "../../../../services/reportService";
import { errorCodes, handleHttpError } from "../../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import paypadService from "../../../../services/paypadService";

const useReport = (dateRange = null, selectedPaypad = null) => {
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

    function getProperty(item, propNames, defaultValue = "N/A") {
      for (const prop of propNames) {
        if (item[prop] !== undefined && item[prop] !== null) {
          return item[prop];
        }
      }
      return defaultValue;
    }

    newReports.forEach((item) => {
      let formattedDate = "N/A";
      const dateCreated = getProperty(item, ["dateCreated", "datE_CREATED", "DATE_CREATED"]);

      if (dateCreated && dateCreated !== "N/A") {
        try {
          formattedDate =
            dateCreated.split("T")[0] +
            " " +
            dateCreated.split("T")[1].substring(0, 8);
        } catch (error) {
          console.log("Error formatting date:", error);
          formattedDate = String(dateCreated);
        }
      }
      const tableItem = {
        id: getProperty(item, ["id", "ID"], 0),
        ID: getProperty(item, ["id", "ID"], 0),
        Referencia: getProperty(item, ["referencia", "REFERENCIA", "Referencia"]),
        Fecha: formattedDate,
        Total: moneyFormater.format(getProperty(item, ["totalAmount", "totaL_AMOUNT", "TOTAL_AMOUNT", "total"], 0)),
        "Tipo de Documento": getProperty(item, ["documenttype", "documenT_TYPE", "DOCUMENT_TYPE"]),
        Documento: getProperty(item, ["document", "DOCUMENT", "Document"]),
        Nombres: getProperty(item, ["name", "NAME", "Name"]),
        Apellidos: getProperty(item, ["lastName", "lastname", "LASTNAME", "LastName"]),
        Celular: getProperty(item, ["phone", "PHONE", "Phone"]),
        Email: getProperty(item, ["email", "EMAIL", "Email"]),
        Trámite: getProperty(item, ["product", "PRODUCT"]),
        Tipo: (() => {
          const paymentType = getProperty(item, ["paymentType", "iD_TYPE_PAYMENT", "paymenttype"]);
          return paymentType === 1 ? "Efectivo" : paymentType === 2 ? "Tarjeta" : "Desconocido";
        })(),
        Estado: (
          <StateLabel
            value={() => {
              const state = getProperty(item, ["stateReport", "STATE", "state", "iD_STATE_TRANSACTION", "ID_STATE_TRANSACTION"]);
              return state === 1
                ? "Iniciada"
                : state === 2
                  ? "Aprobada"
                  : state === 3
                    ? "Cancelada"
                    : state === 4
                      ? "Aprobada Error Devuelta"
                      : state === 5
                        ? "Cancelada Error Devuelta"
                        : state === 6
                          ? "Aprobada Sin Notificar"
                          : state === 7
                            ? "Error Servicio de Tercero"
                            : "Desconocido";
            }}
          />
        ),
      };
      if (typeof element !== "undefined" && element !== null) {
        tableItem["Accion"] = (
          <IconBtn
            clickFunc={() => {
              const itemCopy = { ...item };
              setModalElement(<TransactionDetailView report={itemCopy} />);
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
        let reportData = data;
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
            setInitialReports(reportData);
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

  const getReportsOnePaypadProduct = (internalSelectedPaypad, selectedProduct, concatReports = false) => {
    reportService
      .getByIdPaypadAndDateProduct({
        id: internalSelectedPaypad.id,
        from: dateRange.from,
        to: dateRange.to,
        product: selectedProduct,
      })
      .then((data) => {
        console.log("Raw response data:", data);
        let reportData = data;
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
            setInitialReports(reportData);
          }
        } else {
          console.warn("No reports found in response");
          if (!concatReports) setReports([]);
        }
      })
      .catch(async (error) => {
        console.error("Error in getReportsOnePaypadProduct:", error);
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

  const refreshProduct = async (selectedProduct) => {
    if (dateRange === null || selectedPaypad === null || !selectedProduct) return;
    if (selectedPaypad.id === "all") {
      let paypads = await paypadService
        .getAll()
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
      paypads.forEach((pp) => getReportsOnePaypadProduct(pp, selectedProduct, true));
      return;
    }
    getReportsOnePaypadProduct(selectedPaypad, selectedProduct);
  };

  const refresh = async () => {
    if (dateRange === null || selectedPaypad === null) return;
    if (selectedPaypad.id === "all") {
      let paypads = await paypadService
        .getAll()
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
      paypads.forEach((pp) => getReportsOnePaypad(pp, true));
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


  return { reports, reportsTable, modalElement, setReports, refresh, initialReports, refreshProduct };
};
export default useReport;