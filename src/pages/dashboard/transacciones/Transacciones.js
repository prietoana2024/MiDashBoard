/*import React, { useEffect, useMemo, useState } from "react";
import "../../pages.css";
import withAuthorization from "../../withAuthorization";
// import { TableCrud } from "../../../components/TableCrud";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import ModalGeneric from "../../../components/ModalGeneric";
import { TitlePage } from "../../../components/TitlePage";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import transactionService from "../../../services/transactionService";
import FormDate from "../shared/FormDate";
import useFormDate from "../shared/hooks/useFormDate";
import useTransaction from "../shared/hooks/useTransaction";
import { TransactionsResume } from "./components/TransactionsResume";
import { TransactionsTable } from "./components/TransactionTable";
import useMultiSelectPayPad from "../shared/hooks/useMultiSelectPaypad";
import MultiSelectPayPad from "../shared/multiSelectPaypad";

const formatDate = (fecha) => {
  let month = "" + (fecha.getMonth() + 1),
    day = "" + fecha.getDate(),
    year = fecha.getFullYear();

  if (month.length < 2)
    month = "0" + month;
  if (day.length < 2)
    day = "0" + day;

  return [year, month, day].join("-");
};

const createDataToTransactionResume = (transactions) => {
  // Validar entrada
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      approvedTransactions: { count: 0, totalAmount: 0 },
      canceledTransactions: { count: 0, totalAmount: 0 },
      cashIncome: { count: 0, totalAmountEfectivo: 0 },
      cardIncome: { count: 0, totalAmountTarjeta: 0 },
      withdrawals: { count: 0, totalAmount: 0 }
    };
  }

  // Función auxiliar para convertir valores a números válidos
  const toValidNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Filtrar solo transacciones válidas
  const validTransactions = transactions.filter(t => 
    t && 
    typeof t === "object" && 
    t.stateTransaction
  );

  const approvedTransactions = validTransactions.filter(t => 
    t.stateTransaction && t.stateTransaction.includes("Aprobada")
  );
  
  const canceledTransactions = validTransactions.filter(t => 
    t.stateTransaction === "Cancelada"
  );

  return {
    approvedTransactions: {
      count: approvedTransactions.length,
      totalAmount: approvedTransactions.reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    canceledTransactions: {
      count: canceledTransactions.length,
      totalAmount: 0
    },
    cashIncome: {
      count: approvedTransactions.filter(t => t.typePayment === "Efectivo").length,
      totalAmountEfectivo: approvedTransactions
        .filter(t => t.typePayment === "Efectivo")
        .reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    cardIncome: {
      count: approvedTransactions.filter(t => t.typePayment === "Tarjeta de crédito").length,
      totalAmountTarjeta: approvedTransactions
        .filter(t => t.typePayment === "Tarjeta de crédito")
        .reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    withdrawals: {
      count: validTransactions.length,
      totalAmount: validTransactions.reduce((sum, t) => sum + toValidNumber(t.returnAmount), 0)
    }
  };
};

const Transactions = () => {
  const { dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo } = useFormDate();
  //const { paypads, selectedPaypad, handleChangePaypad } = useSelectPayPad();
  const { paypads, selectedPaypads, handleChangePaypads,getPaypadIdsString,getPaypadNamesString} = useMultiSelectPayPad();
  const { transactionsTable, refresh, modalElement, transactions } = useTransaction(dateRange, selectedPaypad);
  
  // Estado para el filtro de medio de pago
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  
  // Estados para detectar cambios en los parámetros de búsqueda
  const [previousPaypad, setPreviousPaypad] = useState(null);
  const [previousDateRange, setPreviousDateRange] = useState(null);
  
  // Función para formatear el label del tipo de pago
  const formatPaymentTypeLabel = (type) => {
    if (type === "Tarjeta de crédito") return "Tarjeta";
    return type;
  };

  // Opciones de medios de pago basadas en los datos actuales
  const paymentTypeOptions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [{ label: "Todos", value: null }];
    
    // Extraer medios de pago únicos
    const uniquePaymentTypes = [...new Set(transactions.map(t => t.typePayment))];
    
    // Formatear para el dropdown
    return [
      { label: "Todos", value: null },
      ...uniquePaymentTypes.filter(Boolean).map(type => ({ 
        label: formatPaymentTypeLabel(type), 
        value: type 
      }))
    ];
  }, [transactions]);

  // Efecto para detectar cambios en paypad y limpiar filtro
  useEffect(() => {
    if (previousPaypad !== null && selectedPaypad?.id !== previousPaypad?.id) {
      setSelectedPaymentType(null);
    }
    setPreviousPaypad(selectedPaypad);
  }, [selectedPaypad]);

  // Efecto para detectar cambios en dateRange y limpiar filtro
  useEffect(() => {
    if (previousDateRange !== null && 
        (dateRange?.from?.getTime() !== previousDateRange?.from?.getTime() ||
         dateRange?.to?.getTime() !== previousDateRange?.to?.getTime())) {
      setSelectedPaymentType(null);
    }
    setPreviousDateRange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (dateRange === null) return;
    refresh();
  }, [dateRange]);

  const consultTransactions = () => {
    handleSubmitDate(selectedPaypad);
  };

  // Transacciones filtradas por medio de pago
  const filteredTransactions = useMemo(() => {
    if (!selectedPaymentType) return transactions || [];
    return (transactions || []).filter(t => t.typePayment === selectedPaymentType);
  }, [transactions, selectedPaymentType]);

  // Transacciones en tabla filtradas por medio de pago
  const filteredTransactionsTable = useMemo(() => {
    if (!selectedPaymentType) return transactionsTable || [];
    return (transactionsTable || []).filter(t => t["Medio de pago"] === selectedPaymentType);
  }, [transactionsTable, selectedPaymentType]);

  const requestExcel = () => {
    if (dateRange?.from == undefined || dateRange?.to == undefined) return;

    // Usar las transacciones filtradas para el Excel
    let body = {
      transactionIds: filteredTransactions.map(t => t.id),
      paypadId: selectedPaypad?.id,
      fileName: `Reporte_${formatPaymentTypeLabel(selectedPaymentType) || "Todos"}_${selectedPaypad?.username || "Usuario"}_${formatDate(dateRange.from)}_a_${formatDate(dateRange.to)}.xlsx`.replace(" ", "")
    };

    transactionService.getExcelReport(body).catch(async ({ response }) => {
      let [, errMsg] = await handleHttpError(response);
      errMsg = "Ocurrio un error generando el archivo.";
      Swal.fire({
        text: errMsg,
        icon: "error",
      });
      return;
    });
  };

  const resumeTransactions = useMemo(() => {
    return createDataToTransactionResume(filteredTransactions);
  }, [filteredTransactions]);

  // Función para manejar el cambio del filtro de tipo de pago
  const handlePaymentTypeChange = (e) => {
    setSelectedPaymentType(e.value);
  };

  const startContent = (
    <React.Fragment>
      <button className="btn btn-outline-success"
        onClick={requestExcel}>
        <FontAwesomeIcon icon={"fa-solid fa-file-excel"} className="ms-2" style={{ marginRight: "1rem" }} />
        Excel
      </button>
    </React.Fragment>
  );

  return (
    <>
      <ModalGeneric id="transactionModal" elem={modalElement} />
      <div className="p-4 w-100 h-100">
        <TitlePage title={"Transacciones"} icon={"fa-solid fa-money-bill-transfer"}></TitlePage>

        <div className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
          style={{ marginBottom: "3rem", paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "2rem", paddingBottom: "2rem" }}>
          <b>Parametros de busqueda</b>
          <div className="row">
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <MultiSelectPayPad
                paypads={paypads || []}
                selectedPaypads={selectedPaypads}
                handleChangePaypads={handleChangePaypads}
              />
            </div>
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12" style={{ borderLeft: "solid", alignSelf: "center" }}>
              <FormDate handleSubmitDate={handleSubmitDate}
                dateFrom={dateTimeFrom}
                dateTo={dateTimeTo}
                setDateFrom={setDateTimeFrom}
                setDateTo={setDateTimeTo}
              />
            </div>
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12" style={{ borderLeft: "solid", alignSelf: "center" }}>
              <div className="form-group">
                <label htmlFor="paymentTypeFilter" className="form-label">Medio de Pago</label>
                <Dropdown
                  id="paymentTypeFilter"
                  value={selectedPaymentType}
                  options={paymentTypeOptions}
                  onChange={handlePaymentTypeChange}
                  placeholder="Seleccione un medio de pago"
                  className="w-100"
                  disabled={(transactions || []).length === 0}
                  showClear={selectedPaymentType !== null}
                  filter
                  filterBy="label"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-2" style={{ textAlign: "end" }}>
              <button className="btn btn-outline-success" onClick={consultTransactions}>
                <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{ marginRight: "1rem" }} />
                Consultar
              </button>
            </div>
          </div>
        </div>
        <TransactionsResume transactionsResume={resumeTransactions}></TransactionsResume>

        <div className="container-fluid mt-4 pt-2 bg-dark rounded-4 overflow-auto">
          {(filteredTransactions || []).length <= 0 ? "" : <Toolbar start={startContent}></Toolbar>}
          <TransactionsTable transactionsTable={filteredTransactionsTable} dateRange={dateRange} ></TransactionsTable>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Transactions"], Transactions);*/

/*
import React, { useEffect, useMemo, useState } from "react";
import "../../pages.css";
import withAuthorization from "../../withAuthorization";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import ModalGeneric from "../../../components/ModalGeneric";
import { TitlePage } from "../../../components/TitlePage";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import transactionService from "../../../services/transactionService";
import FormDate from "../shared/FormDate";
import useFormDate from "../shared/hooks/useFormDate";
import useTransaction from "../shared/hooks/useTransaction";
import { TransactionsResume } from "./components/TransactionsResume";
import { TransactionsTable } from "./components/TransactionTable";
import useMultiSelectPayPad from "../shared/hooks/useMultiSelectPaypad";
import MultiSelectPayPad from "../shared/multiSelectPaypad";

const formatDate = (fecha) => {
  let month = "" + (fecha.getMonth() + 1),
    day = "" + fecha.getDate(),
    year = fecha.getFullYear();

  if (month.length < 2)
    month = "0" + month;
  if (day.length < 2)
    day = "0" + day;

  return [year, month, day].join("-");
};

const createDataToTransactionResume = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      approvedTransactions: { count: 0, totalAmount: 0 },
      canceledTransactions: { count: 0, totalAmount: 0 },
      cashIncome: { count: 0, totalAmountEfectivo: 0 },
      cardIncome: { count: 0, totalAmountTarjeta: 0 },
      withdrawals: { count: 0, totalAmount: 0 }
    };
  }

  const toValidNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const validTransactions = transactions.filter(t =>
    t &&
    typeof t === "object" &&
    t.stateTransaction
  );

  const approvedTransactions = validTransactions.filter(t =>
    t.stateTransaction && t.stateTransaction.includes("Aprobada")
  );

  const canceledTransactions = validTransactions.filter(t =>
    t.stateTransaction === "Cancelada"
  );

  return {
    approvedTransactions: {
      count: approvedTransactions.length,
      totalAmount: approvedTransactions.reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    canceledTransactions: {
      count: canceledTransactions.length,
      totalAmount: 0
    },
    cashIncome: {
      count: approvedTransactions.filter(t => t.typePayment === "Efectivo").length,
      totalAmountEfectivo: approvedTransactions
        .filter(t => t.typePayment === "Efectivo")
        .reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    cardIncome: {
      count: approvedTransactions.filter(t => t.typePayment === "Tarjeta de crédito").length,
      totalAmountTarjeta: approvedTransactions
        .filter(t => t.typePayment === "Tarjeta de crédito")
        .reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    withdrawals: {
      count: validTransactions.length,
      totalAmount: validTransactions.reduce((sum, t) => sum + toValidNumber(t.returnAmount), 0)
    }
  };
};

const Transacciones = () => {
  const { dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo } = useFormDate();

  // Hook de selección múltiple
  const {
    paypads,
    selectedPaypads,
    handleChangePaypads,
    getPaypadIdsString,
    getPaypadNamesString
  } = useMultiSelectPayPad();

  // CORRECCIÓN: Pasar selectedPaypads en lugar de selectedPaypad
  const { transactionsTable, refresh, modalElement, transactions } = useTransaction(dateRange, selectedPaypads);

  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [previousPaypad, setPreviousPaypad] = useState(null);
  const [previousDateRange, setPreviousDateRange] = useState(null);

  const formatPaymentTypeLabel = (type) => {
    if (type === "Tarjeta de crédito") return "Tarjeta";
    return type;
  };

  const paymentTypeOptions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [{ label: "Todos", value: null }];

    const uniquePaymentTypes = [...new Set(transactions.map(t => t.typePayment))];

    return [
      { label: "Todos", value: null },
      ...uniquePaymentTypes.filter(Boolean).map(type => ({
        label: formatPaymentTypeLabel(type),
        value: type
      }))
    ];
  }, [transactions]);

  // CORRECCIÓN: Comparar arrays en lugar de objetos
  useEffect(() => {
    if (previousPaypad !== null) {
      const prevIds = (previousPaypad || []).map(p => p.id).sort().join(",");
      const currIds = (selectedPaypads || []).map(p => p.id).sort().join(",");

      if (prevIds !== currIds) {
        setSelectedPaymentType(null);
      }
    }
    setPreviousPaypad(selectedPaypads);
  }, [selectedPaypads]);

  useEffect(() => {
    if (previousDateRange !== null &&
      (dateRange?.from?.getTime() !== previousDateRange?.from?.getTime() ||
        dateRange?.to?.getTime() !== previousDateRange?.to?.getTime())) {
      setSelectedPaymentType(null);
    }
    setPreviousDateRange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (dateRange === null) return;
    refresh();
  }, [dateRange]);

  // CORRECCIÓN: Validar array de paypads
  const consultTransactions = () => {
    if (!selectedPaypads || selectedPaypads.length === 0) {
      Swal.fire({
        text: "Debe seleccionar al menos un PayPad",
        icon: "warning",
      });
      return;
    }
    handleSubmitDate(selectedPaypads);
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedPaymentType) return transactions || [];
    return (transactions || []).filter(t => t.typePayment === selectedPaymentType);
  }, [transactions, selectedPaymentType]);

  const filteredTransactionsTable = useMemo(() => {
    if (!selectedPaymentType) return transactionsTable || [];
    return (transactionsTable || []).filter(t => t["Medio de pago"] === selectedPaymentType);
  }, [transactionsTable, selectedPaymentType]);

  const requestExcel = () => {
  // Validar rango de fechas
    if (!dateRange?.from || !dateRange?.to) {
      Swal.fire({
        text: "Debe seleccionar un rango de fechas",
        icon: "warning",
      });
      return;
    }

    // Validar PayPads seleccionados
    if (!selectedPaypads || selectedPaypads.length === 0) {
      Swal.fire({
        text: "Debe seleccionar al menos un PayPad",
        icon: "warning",
      });
      return;
    }

    // Validar que haya transacciones para exportar
    if (!filteredTransactions || filteredTransactions.length === 0) {
      Swal.fire({
        text: "No hay transacciones para exportar",
        icon: "warning",
      });
      return;
    }

    // Formato ISO 8601 para las fechas
    const formatDateISO = (date) => {
      return date.toISOString(); // Genera: "2025-10-08T14:30:00.000Z"
    };

    // Construir el DTO que espera el backend
    const body = {
      From: dateRange.from,
      To: dateRange.to,
       IdsPaypads: selectedPaypads.map(p => p.id) // Array de números: [1, 2, 3]
    };

    // Llamar al servicio
    console.log
    transactionService.getExcelReportAll(body)
      .catch(async ({ response }) => {
        let [, errMsg] = await handleHttpError(response);
        Swal.fire({
          text: errMsg || "Ocurrió un error generando el archivo.",
          icon: "error",
        });
      });
  };

  const resumeTransactions = useMemo(() => {
    return createDataToTransactionResume(filteredTransactions);
  }, [filteredTransactions]);

  const handlePaymentTypeChange = (e) => {
    setSelectedPaymentType(e.value);
  };

  const startContent = (
    <React.Fragment>
      <button className="btn btn-outline-success"
        onClick={requestExcel}>
        <FontAwesomeIcon icon={"fa-solid fa-file-excel"} className="ms-2" style={{ marginRight: "1rem" }} />
        Excel
      </button>
    </React.Fragment>
  );

  return (
    <>
      <ModalGeneric id="transactionModal" elem={modalElement} />
      <div className="p-4 w-100 h-100">
        <TitlePage title={"Transacciones"} icon={"fa-solid fa-money-bill-transfer"}></TitlePage>

        <div className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
          style={{ marginBottom: "3rem", paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "2rem", paddingBottom: "2rem" }}>
          <b>Parametros de busqueda</b>
          <div className="row">
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <MultiSelectPayPad
                paypads={paypads || []}
                selectedPaypads={selectedPaypads}
                handleChangePaypads={handleChangePaypads}
              />
            </div>
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12" style={{ borderLeft: "solid", alignSelf: "center" }}>
              <FormDate handleSubmitDate={handleSubmitDate}
                dateFrom={dateTimeFrom}
                dateTo={dateTimeTo}
                setDateFrom={setDateTimeFrom}
                setDateTo={setDateTimeTo}
              />
            </div>
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12" style={{ borderLeft: "solid", alignSelf: "center" }}>
              <div className="form-group">
                <label htmlFor="paymentTypeFilter" className="form-label">Medio de Pago</label>
                <Dropdown
                  id="paymentTypeFilter"
                  value={selectedPaymentType}
                  options={paymentTypeOptions}
                  onChange={handlePaymentTypeChange}
                  placeholder="Seleccione un medio de pago"
                  className="w-100"
                  disabled={(transactions || []).length === 0}
                  showClear={selectedPaymentType !== null}
                  filter
                  filterBy="label"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-2" style={{ textAlign: "end" }}>
              <button className="btn btn-outline-success" onClick={consultTransactions}>
                <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{ marginRight: "1rem" }} />
                Consultar
              </button>
            </div>
          </div>
        </div>
        <TransactionsResume transactionsResume={resumeTransactions}></TransactionsResume>

        <div className="container-fluid mt-4 pt-2 bg-dark rounded-4 overflow-auto">
          {(filteredTransactions || []).length <= 0 ? "" : <Toolbar start={startContent}></Toolbar>}
          <TransactionsTable transactionsTable={filteredTransactionsTable} dateRange={dateRange} ></TransactionsTable>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Transacciones"], Transacciones);*/

import React, { useEffect, useMemo, useState } from "react";
import "../../pages.css";
import withAuthorization from "../../withAuthorization";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
import ModalGeneric from "../../../components/ModalGeneric";
import { TitlePage } from "../../../components/TitlePage";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import transactionService from "../../../services/transactionService";
import FormDate from "../shared/FormDate";
import useFormDate from "../shared/hooks/useFormDate";
import useTransaction from "../shared/hooks/useTransaction";
import { TransactionsResume } from "./components/TransactionsResume";
import { TransactionsTable } from "./components/TransactionTable";
import useMultiSelectPayPad from "../shared/hooks/useMultiSelectPaypad";
import MultiSelectPayPad from "../shared/multiSelectPaypad";

const createDataToTransactionResume = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      approvedTransactions: { count: 0, totalAmount: 0 },
      canceledTransactions: { count: 0, totalAmount: 0 },
      cashIncome: { count: 0, totalAmountEfectivo: 0 },
      cardIncome: { count: 0, totalAmountTarjeta: 0 },
      withdrawals: { count: 0, totalAmount: 0 }
    };
  }

  const toValidNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const validTransactions = transactions.filter(
    (t) => t && typeof t === "object" && t.stateTransaction
  );

  const approvedTransactions = validTransactions.filter(
    (t) => t.stateTransaction && t.stateTransaction.includes("Aprobada")
  );

  const canceledTransactions = validTransactions.filter(
    (t) => t.stateTransaction === "Cancelada"
  );

  return {
    approvedTransactions: {
      count: approvedTransactions.length,
      totalAmount: approvedTransactions.reduce(
        (sum, t) => sum + toValidNumber(t.totalAmount),
        0
      )
    },
    canceledTransactions: {
      count: canceledTransactions.length,
      totalAmount: 0
    },
    cashIncome: {
      count: approvedTransactions.filter((t) => t.typePayment === "Efectivo").length,
      totalAmountEfectivo: approvedTransactions
        .filter((t) => t.typePayment === "Efectivo")
        .reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    cardIncome: {
      count: approvedTransactions.filter((t) => t.typePayment === "Tarjeta de crédito").length,
      totalAmountTarjeta: approvedTransactions
        .filter((t) => t.typePayment === "Tarjeta de crédito")
        .reduce((sum, t) => sum + toValidNumber(t.totalAmount), 0)
    },
    withdrawals: {
      count: validTransactions.length,
      totalAmount: validTransactions.reduce(
        (sum, t) => sum + toValidNumber(t.returnAmount),
        0
      )
    }
  };
};

const Transacciones = () => {
  const {
    dateRange,
    handleSubmitDate,
    dateTimeFrom,
    dateTimeTo,
    setDateTimeFrom,
    setDateTimeTo
  } = useFormDate();

  const {
    paypads,
    selectedPaypads,
    handleChangePaypads
  } = useMultiSelectPayPad();

  const { transactionsTable, refresh, modalElement, transactions } =
    useTransaction(dateRange, selectedPaypads);

  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [previousPaypad, setPreviousPaypad] = useState(null);
  const [previousDateRange, setPreviousDateRange] = useState(null);

  const formatPaymentTypeLabel = (type) => {
    if (type === "Tarjeta de crédito") return "Tarjeta";
    return type;
  };

  const paymentTypeOptions = useMemo(() => {
    if (!transactions || transactions.length === 0)
      return [{ label: "Todos", value: null }];

    const uniquePaymentTypes = [...new Set(transactions.map((t) => t.typePayment))];

    return [
      { label: "Todos", value: null },
      ...uniquePaymentTypes.filter(Boolean).map((type) => ({
        label: formatPaymentTypeLabel(type),
        value: type
      }))
    ];
  }, [transactions]);

  useEffect(() => {
    if (previousPaypad !== null) {
      const prevIds = (previousPaypad || []).map((p) => p.id).sort().join(",");
      const currIds = (selectedPaypads || []).map((p) => p.id).sort().join(",");

      if (prevIds !== currIds) {
        setSelectedPaymentType(null);
      }
    }
    setPreviousPaypad(selectedPaypads);
  }, [selectedPaypads]);

  useEffect(() => {
    if (
      previousDateRange !== null &&
      (dateRange?.from?.getTime() !== previousDateRange?.from?.getTime() ||
        dateRange?.to?.getTime() !== previousDateRange?.to?.getTime())
    ) {
      setSelectedPaymentType(null);
    }
    setPreviousDateRange(dateRange);
  }, [dateRange]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (dateRange === null) return;
    refresh();
  }, [dateRange]);

  const consultTransactions = () => {
    if (!selectedPaypads || selectedPaypads.length === 0) {
      Swal.fire({
        text: "Debe seleccionar al menos un PayPad",
        icon: "warning"
      });
      return;
    }
    handleSubmitDate(selectedPaypads);
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedPaymentType) return transactions || [];
    return (transactions || []).filter(
      (t) => t.typePayment === selectedPaymentType
    );
  }, [transactions, selectedPaymentType]);

  const filteredTransactionsTable = useMemo(() => {
    if (!selectedPaymentType) return transactionsTable || [];
    return (transactionsTable || []).filter(
      (t) => t["Medio de pago"] === selectedPaymentType
    );
  }, [transactionsTable, selectedPaymentType]);


  const requestExcel = () => {
    if (!dateRange?.from || !dateRange?.to) {
      Swal.fire({
        text: "Debe seleccionar un rango de fechas",
        icon: "warning"
      });
      return;
    }

    if (!selectedPaypads || selectedPaypads.length === 0) {
      Swal.fire({
        text: "Debe seleccionar al menos un PayPad",
        icon: "warning"
      });
      return;
    }

    if (!filteredTransactions || filteredTransactions.length === 0) {
      Swal.fire({
        text: "No hay transacciones para exportar",
        icon: "warning"
      });
      return;
    }

    console.log("Generando Excel...");

    // 🔥 CORRECCIÓN: Formato correcto del body
    let body = {
      idsPaypads: selectedPaypads.map(p => p.id).join(","), // String: "1,6,25"
      from: dateRange.from.toISOString(), // ISO string: "2024-04-01T18:50:18.619Z"
      to: dateRange.to.toISOString()       // ISO string: "2024-04-18T18:50:18.619Z"
    };

    console.log("Body enviado:", JSON.stringify(body, null, 2));

    transactionService
      .getExcelReportAll(body)
      .catch(async ({ response }) => {
        let [, errMsg] = await handleHttpError(response);
        Swal.fire({
          text: errMsg || "Ocurrió un error generando el archivo.",
          icon: "error"
        });
      });
  };
  const resumeTransactions = useMemo(() => {
    return createDataToTransactionResume(filteredTransactions);
  }, [filteredTransactions]);

  const handlePaymentTypeChange = (e) => {
    setSelectedPaymentType(e.value);
  };

  const startContent = (
    <React.Fragment>
      <button className="btn btn-outline-success" onClick={requestExcel}>
        <FontAwesomeIcon
          icon={"fa-solid fa-file-excel"}
          className="ms-2"
          style={{ marginRight: "1rem" }}
        />
        Excel
      </button>
    </React.Fragment>
  );

  return (
    <>
      <ModalGeneric id="transactionModal" elem={modalElement} />
      <div className="p-4 w-100 h-100">
        <TitlePage
          title={"Transacciones"}
          icon={"fa-solid fa-money-bill-transfer"}
        ></TitlePage>

        <div
          className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
          style={{
            marginBottom: "3rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            paddingTop: "2rem",
            paddingBottom: "2rem"
          }}
        >
          <b>Parametros de busqueda</b>
          <div className="row">
            <div className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <MultiSelectPayPad
                paypads={paypads || []}
                selectedPaypads={selectedPaypads}
                handleChangePaypads={handleChangePaypads}
              />
            </div>
            <div
              className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12"
              style={{ borderLeft: "solid", alignSelf: "center" }}
            >
              <FormDate
                handleSubmitDate={handleSubmitDate}
                dateFrom={dateTimeFrom}
                dateTo={dateTimeTo}
                setDateFrom={setDateTimeFrom}
                setDateTo={setDateTimeTo}
              />
            </div>
            <div
              className="col-12 col-xl-4 col-lg-4 col-md-12 col-sm-12"
              style={{ borderLeft: "solid", alignSelf: "center" }}
            >
              <div className="form-group">
                <label htmlFor="paymentTypeFilter" className="form-label">
                  Medio de Pago
                </label>
                <Dropdown
                  id="paymentTypeFilter"
                  value={selectedPaymentType}
                  options={paymentTypeOptions}
                  onChange={handlePaymentTypeChange}
                  placeholder="Seleccione un medio de pago"
                  className="w-100"
                  disabled={(transactions || []).length === 0}
                  showClear={selectedPaymentType !== null}
                  filter
                  filterBy="label"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-2" style={{ textAlign: "end" }}>
              <button
                className="btn btn-outline-success"
                onClick={consultTransactions}
              >
                <FontAwesomeIcon
                  icon={"fa-solid fa-search"}
                  className="ms-2"
                  style={{ marginRight: "1rem" }}
                />
                Consultar
              </button>
            </div>
          </div>
        </div>
        <TransactionsResume
          transactionsResume={resumeTransactions}
        ></TransactionsResume>

        <div className="container-fluid mt-4 pt-2 bg-dark rounded-4 overflow-auto">
          {(filteredTransactions || []).length <= 0 ? (
            ""
          ) : (
            <Toolbar start={startContent}></Toolbar>
          )}
          <TransactionsTable
            transactionsTable={filteredTransactionsTable}
            dateRange={dateRange}
          ></TransactionsTable>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Transacciones"], Transacciones);
