import React, { useEffect, useMemo } from "react";
import "../../pages.css";
import withAuthorization from "../../withAuthorization";
// import { TableCrud } from "../../../components/TableCrud";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toolbar } from "primereact/toolbar";
import Swal from "sweetalert2";
import ModalGeneric from "../../../components/ModalGeneric";
import { TitlePage } from "../../../components/TitlePage";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import transactionService from "../../../services/transactionService";
import FormDate from "../shared/FormDate";
import useFormDate from "../shared/hooks/useFormDate";
import useSelectPayPad from "../shared/hooks/useSelectPayPad";
import useTransaction from "../shared/hooks/useTransaction";
import SelectPayPad from "../shared/SelectPayPad";
import { TransactionsResume } from "./components/TransactionsResume";
import { TransactionsTable } from "./components/TransactionTable";

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
/*
const createDataToTransactionResume = (groupedTransaction) => {
  return Object.keys(groupedTransaction).map(key => ({
    label: key,
    amountTransactions: groupedTransaction[key].length,
    totalAmount: () => {
      var total = 0;
      groupedTransaction[key].forEach(tr => { total += (tr.incomeAmount-tr.returned);});
      return total;
    }
  }));
};*/
const createDataToTransactionResume = (transactions) => {
  const approvedTransactions = transactions.filter(t => t.stateTransaction.includes("Aprobada"));
  const canceledTransactions = transactions.filter(t => t.stateTransaction === "Cancelada");

  return {
    approvedTransactions: {
      count: approvedTransactions.length,
      totalAmount: approvedTransactions.reduce((sum, t) => sum + t.incomeAmount, 0)
    },
    canceledTransactions: {
      count: canceledTransactions.length,
      totalAmount: 0
    },
    cashIncome: {
      count: approvedTransactions.filter(t => t.typePayment === "Efectivo").length,
      totalAmount: approvedTransactions
        .filter(t => t.typePayment === "Efectivo")
        .reduce((sum, t) => sum + t.incomeAmount, 0)
    },
    cardIncome: {
      count: approvedTransactions.filter(t => t.typePayment === "Tarjeta de crédito").length,
      totalAmount: approvedTransactions
        .filter(t => t.typePayment === "Tarjeta de crédito")
        .reduce((sum, t) => sum + t.incomeAmount, 0)
    },
    withdrawals: {
      count: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.returnAmount, 0)
    }
  };
};

const Transactions = () => {

  const { dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo } = useFormDate();
  const { paypads, selectedPaypad, handleChangePaypad } = useSelectPayPad();
  const { transactionsTable, refresh, modalElement, transactions } = useTransaction(dateRange, selectedPaypad);

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

  const requestExcel = () => {
    if (dateRange.from == undefined || dateRange.to == undefined) return;

    let body = {
      transactionIds: transactions.map(t => t.id),
      paypadId: selectedPaypad.id,
      fileName: `Reporte_${selectedPaypad.username}_${formatDate(dateRange.from)}_a_${formatDate(dateRange.to)}.xlsx`.replace(" ", "")
    };

    transactionService.getExcelReport(body).catch(async ({ response }) => {
      let [, errMsg] = await handleHttpError(response);
      errMsg = "Ocurrio un error generando el archivo.";
      Swal.fire({
        text: errMsg,
        icon: "error",
      });
      return;
    }
    );
  };
  const resumeTransactions = useMemo(() => {
    return createDataToTransactionResume(transactions);
  }, [transactions]);
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
            <div className="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <SelectPayPad
                paypads={paypads ? paypads : []}
                paypadSelected={selectedPaypad}
                handleChangePaypad={handleChangePaypad}
              />
            </div>
            <div className="col-12 col-xl-6 col-lg-6 col-md-12 col-sm-12" style={{ borderLeft: "solid", alignSelf: "center" }}>
              <FormDate handleSubmitDate={handleSubmitDate}
                dateFrom={dateTimeFrom}
                dateTo={dateTimeTo}
                setDateFrom={setDateTimeFrom}
                setDateTo={setDateTimeTo}
              />
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

        <div className="container-fluid mt-4 pt-2 bg-dark rounded-4  overflow-auto">
          {transactions.length <= 0 ? "" : <Toolbar start={startContent}></Toolbar>}
          <TransactionsTable transactionsTable={transactionsTable} dateRange={dateRange} ></TransactionsTable>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Transactions"], Transactions);
