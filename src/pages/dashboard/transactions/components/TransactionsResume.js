/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "primereact/card";
import PropTypes from "prop-types";
import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import "../../../pages.css";


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

  //const totalRecaudado = transactionsResume?.cashIncome?.totalAmount + transactionsResume?.cardIncome?.totalAmount || 0;

  
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
                  value={moneyFormater.format(transactionsResume.cardIncome.totalAmountEfectivo)}
                  message={"Recaudo en Efectivo"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-credit-card"}
                  value={moneyFormater.format(transactionsResume.cardIncome.totalAmountTarjeta)}
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
                  value={moneyFormater.format(transactionsResume.approvedTransactions.totalAmount)}
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

*/

/*
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "primereact/card";
import PropTypes from "prop-types";
import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import "../../../pages.css";

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

  // Función auxiliar para formatear números de forma segura
  const safeFormatMoney = (value) => {
    const numValue = parseFloat(value);
    return moneyFormater.format(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <>
      {transactionsResume && Object.keys(transactionsResume).length > 0 ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-square-check"}
                  value={transactionsResume.approvedTransactions?.count || 0}
                  message={"Transacciones aprobadas"}
                  color="green"
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-ban"}
                  value={transactionsResume.canceledTransactions?.count || 0}
                  message={"Transacciones rechazadas"}
                  color="red"
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-money-bill"}
                  value={safeFormatMoney(transactionsResume.cashIncome?.totalAmountEfectivo)}
                  message={"Recaudo en Efectivo"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-credit-card"}
                  value={safeFormatMoney(transactionsResume.cardIncome?.totalAmountTarjeta)}
                  message={"Recaudo por Tarjeta"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-arrow-trend-down"}
                  value={safeFormatMoney(transactionsResume.withdrawals?.totalAmount)}
                  message={"Valor entregado"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center"}}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-dollar-sign"}
                  value={safeFormatMoney(transactionsResume.approvedTransactions?.totalAmount)}
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

export { TransactionsResume };*/
/*
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "primereact/card";
import PropTypes from "prop-types";
import React from "react";
import "../../../pages.css";

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
  color: PropTypes.string // ✅ CORREGIDO: PropTypes con P mayúscula
};

const TransactionsResume = ({ transactionsResume }) => {
  const moneyFormater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  // Función auxiliar para formatear números de forma segura
  const safeFormatMoney = (value) => {
    const numValue = parseFloat(value);
    return moneyFormater.format(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <>
      {transactionsResume && Object.keys(transactionsResume).length > 0 ? (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-square-check"}
                  value={transactionsResume.approvedTransactions?.count || 0}
                  message={"Transacciones aprobadas"}
                  color="green"
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-ban"}
                  value={transactionsResume.canceledTransactions?.count || 0}
                  message={"Transacciones rechazadas"}
                  color="red"
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-money-bill"}
                  value={safeFormatMoney(transactionsResume.cashIncome?.totalAmountEfectivo)}
                  message={"Recaudo en Efectivo"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-credit-card"}
                  value={safeFormatMoney(transactionsResume.cardIncome?.totalAmountTarjeta)}
                  message={"Recaudo por Tarjeta"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-arrow-trend-down"}
                  value={safeFormatMoney(transactionsResume.withdrawals?.totalAmount)}
                  message={"Valor entregado"}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-12 mt-3" style={{ textAlign: "center"}}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-dollar-sign"}
                  value={safeFormatMoney(transactionsResume.approvedTransactions?.totalAmount)}
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

export { TransactionsResume };*/

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "primereact/card";
import PropTypes from "prop-types";
import React from "react";
import "../../../pages.css";

// Estilos personalizados para el grid
const customGridStyles = `
  @media (min-width: 768px) {
    .custom-col-md-4 {
      flex: 0 0 auto !important;
      width: 33.33333333% !important;
    }
  }

  @media (min-width: 992px) {
    .custom-col-lg-4 {
      flex: 0 0 auto !important;
      width: 33.33333333% !important;
    }
  }

  @media (min-width: 1200px) {
    .custom-col-xl-2 {
      flex: 0 0 auto !important;
      width: 16.66666667% !important;
    }
      .h4, h4 {
      font-size: 1.5rem !important;
    }
  }

  @media (max-width: 767px) {
    .custom-col-sm-6 {
      flex: 0 0 auto !important;
      width: 50% !important;
    }
  }
  @media (max-width: 1979px) {
      .h4, h4 {
        font-size: 1rem !important;
      }
    }

  .custom-col-12 {
    flex: 0 0 auto !important;
    width: 100% !important;
  }
    .m-0 {
    margin: 0 !important;
  }
`;

// Inyectar estilos en el head si no existen
const injectStyles = () => {
  const styleId = "custom-grid-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = customGridStyles;
    document.head.appendChild(style);
  }
};

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
  color: PropTypes.string
};

const TransactionsResume = ({ transactionsResume }) => {
  // Inyectar estilos cuando el componente se monta
  React.useEffect(() => {
    injectStyles();
  }, []);

  const moneyFormater = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  // Función auxiliar para formatear números de forma segura
  const safeFormatMoney = (value) => {
    const numValue = parseFloat(value);
    return moneyFormater.format(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <>
      {transactionsResume && Object.keys(transactionsResume).length > 0 ? (
        <div className="container-fluid">
          <div className="row">
            <div className="custom-col-xl-2 custom-col-lg-4 custom-col-md-4 custom-col-sm-6 custom-col-4 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-square-check"}
                  value={transactionsResume.approvedTransactions?.count || 0}
                  message={"Transacciones aprobadas"}
                  color="green"
                />
              </div>
            </div>
            <div className="custom-col-xl-2 custom-col-lg-4 custom-col-md-4 custom-col-sm-6 custom-col-4 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-ban"}
                  value={transactionsResume.canceledTransactions?.count || 0}
                  message={"Transacciones rechazadas"}
                  color="red"
                />
              </div>
            </div>
            <div className="custom-col-xl-2 custom-col-lg-4 custom-col-md-4 custom-col-sm-6 custom-col-4 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-money-bill"}
                  value={safeFormatMoney(transactionsResume.cashIncome?.totalAmountEfectivo)}
                  message={"Recaudo en Efectivo"}
                />
              </div>
            </div>
            <div className="custom-col-xl-2 custom-col-lg-4 custom-col-md-4 custom-col-sm-6 custom-col-4 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-credit-card"}
                  value={safeFormatMoney(transactionsResume.cardIncome?.totalAmountTarjeta)}
                  message={"Recaudo por Tarjeta"}
                />
              </div>
            </div>
            <div className="custom-col-xl-2 custom-col-lg-4 custom-col-md-4 custom-col-sm-6 custom-col-4 mt-3" style={{ textAlign: "center" }}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-arrow-trend-down"}
                  value={safeFormatMoney(transactionsResume.withdrawals?.totalAmount)}
                  message={"Valor entregado"}
                />
              </div>
            </div>
            <div className="custom-col-xl-2 custom-col-lg-4 custom-col-md-4 custom-col-sm-6 custom-col-4 mt-3" style={{ textAlign: "center"}}>
              <div style={{ height: "166px" }}>
                <TransactionCardResume
                  icon={"fa-solid fa-dollar-sign"}
                  value={safeFormatMoney(transactionsResume.approvedTransactions?.totalAmount)}
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