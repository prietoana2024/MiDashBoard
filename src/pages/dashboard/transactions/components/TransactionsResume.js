import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "primereact/card";
import PropTypes from "prop-types";
import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import "../../../pages.css";

/*const TransactionCardResume = (props) => {
  return (
    <Card style={{ maxWidth: "25rem", backgroundColor: props.color || "#2a323d", color: props.color ? "white" : "white" }}>
      <div className="row">
        <div className="col-4">
          <FontAwesomeIcon icon={props.icon} className="ms-2" style={{ height: "3rem", minHeight: "3rem" }} />
        </div>
        <div className="col-8" style={{ alignSelf: "center", textAlign: "end", fontSize: "0.8rem" }}>
          <h4 className="m-0">
            {props.value}
          </h4>
          <h4 className="m-0">
            {props.message}
          </h4>
        </div>
      </div>
    </Card>
  );
};*/
const TransactionCardResume = (props) => {
  // Function to calculate font size based on screen width
  const calculateFontSize = () => {
    const screenWidth = window.innerWidth;
    // Adjust these values to fit your desired scale
    if (screenWidth < 600) return "0.6rem"; // Small screens
    if (screenWidth < 900) return "0.8rem"; // Medium screens
    return "1rem"; // Larger screens
  };

  return (
    <Card style={{
      maxWidth: "25rem",
      backgroundColor: props.color || "#2a323d",
      color: "white",
      height:"166px"
    }}>
      <div className="row">
        <div className="col-4">
          <FontAwesomeIcon icon={props.icon} className="ms-2" style={{ height: "3rem", minHeight: "3rem" }} />
        </div>
        <div className="col-8" style={{
          alignSelf: "center",
          textAlign: "end",
          fontSize: calculateFontSize() // Apply dynamic font sizing
        }}>
          <h4 className="m-0">
            {props.value}
          </h4>
          <h4 className="m-0">
            {props.message}
          </h4>
        </div>
      </div>
    </Card>
  );
};
TransactionCardResume.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  message: PropTypes.string,
  color: propTypes.string
};

const TransactionsResume = ({ transactionsResume }) => {
  const moneyFormater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const totalRecaudado = transactionsResume?.cashIncome?.totalAmount + transactionsResume?.cardIncome?.totalAmount || 0;

  
  return (
    <>
      {transactionsResume && Object.keys(transactionsResume).length > 0 ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-square-check"}
                  value={transactionsResume.approvedTransactions.count}
                  message={"Transacciones aprobadas"}
                  color="green"
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-ban"}
                  value={transactionsResume.canceledTransactions.count}
                  message={"Transacciones rechazadas"}
                  color="red"
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-money-bill"}
                  value={moneyFormater.format(transactionsResume.cashIncome.totalAmount)}
                  message={"Recaudo en Efectivo"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-credit-card"}
                  value={moneyFormater.format(transactionsResume.cardIncome.totalAmount)}
                  message={"Recaudo por Tarjeta"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-arrow-trend-down"}
                  value={moneyFormater.format(transactionsResume.withdrawals.totalAmount)}
                  message={"Retiros"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center"}}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-dollar-sign"}
                  value={moneyFormater.format(totalRecaudado)}
                  message={"Total recaudado"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

TransactionsResume.propTypes = {
  transactionsResume: PropTypes.object,
};

export { TransactionsResume };

