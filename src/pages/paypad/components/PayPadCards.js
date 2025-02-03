import React from "react";
// import GenericCard from "../../../components/GenericCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "primereact/card";
import PropTypes from "prop-types";


const PaypadCards = ({ data }) => {
  return (
    <div className="container p-2">
      <div className="row">
        {data.map((paypad) => (
          <div key={paypad.id} className="col-xl-3 mt-3" style={{ textAlign: "-webkit-center" }}>
            <Card className="card-pay-pad" style={{ maxHeigth: "20rem", height: "20rem" }}>
              <div className="p-2">
                <div>
                  <h3 style={{ overflowWrap: "break-word", fontSize: "1.3rem" }}>
                    {paypad["Nombre"]}
                  </h3>
                </div>
                <div>
                  <FontAwesomeIcon icon="fa-solid fa-building" />
                  <span className="ms-2">{paypad["Sucursal"].name}</span>
                  <br></br>
                  <span>{paypad["Sucursal"].address}</span>
                </div>
                <div className="mt-3" style={{ fontSize: "0.8rem" }}>
                  {paypad["MenuTemplate"]}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

PaypadCards.propTypes = {
  data: PropTypes.array.isRequired,
};

export default PaypadCards;
