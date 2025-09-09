/*import "../pages.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withAuthorization from "../withAuthorization";
import FormPayPad from "./components/FormPayPad";
import PaypadCards from "./components/PayPadCards";
import {TitlePage} from "../../components/TitlePage";
import { usePaypadFunctionalities } from "./hooks/usePaypadFunctionalities";
import useModelFormat from "./hooks/useModelFormat";
import { usePreConfig } from "./hooks/usePreConfig";
import { Dialog } from "primereact/dialog";

const PayPad = () => {
  const [actualMain, setMainView] = useState({ showform: false, idToUpdate: null });
  const {refresh, paypads, offices} = usePreConfig();
  const {paypadInfoFormated, modalElement, buildModel, permissions} = useModelFormat();
  const functionalities = usePaypadFunctionalities(refresh, setMainView);
  const [dialogProperties, setDialogProperties] = useState({visible: false, width: "50vw"});

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (paypads !== null && offices !== null) buildModel(paypads, offices, functionalities, setMainView);
  }, [paypads, offices]);

  useEffect(() => {
    if(modalElement){
      setDialogProperties({visible: true, width: modalElement.type.name === "PayPadBalanceView"?"90vw":"60vw"});
    }
    else{
      setDialogProperties({visible: false, width: "50vw"});
    }
  }, [modalElement]);


  const renderList = () => {
    return (
      <>
        {paypadInfoFormated.length > 0 ? <PaypadCards data={paypadInfoFormated} /> : ""}
      </>
    );
  };

  const renderForm = () => {
    return (
      <FormPayPad
        createHandler={functionalities.createPaypad}
        editHandler={functionalities.updatePaypad}
        backHandler={functionalities.back}
        idToEdit={actualMain.idToUpdate}
      />
    );
  };

  return (
    <>
      <Dialog maximizable position="top" visible={dialogProperties.visible} breakpoints={{"960px": "75vw", "640px": "100vw"}} style={{ width: dialogProperties.width }} onHide={() => setDialogProperties(false)}>
        {modalElement}
      </Dialog>
      <div className="p-4 w-100 h-100">
        <TitlePage title={"Pay+"} icon={"fa-solid fa-hand-holding-dollar"}></TitlePage>
        {permissions.filter((p) => p.name === "WritePayPads").length > 0 ? (
          <button
            className="btn btn-outline-success mx-3"
            onClick={() => {
              setMainView({ showform: true, idToUpdate: null });
            }}
          >
            <FontAwesomeIcon
              className="me-2"
              icon="fa-solid fa-money-check-dollar"
            />
            <span>Crear Pay+</span>
          </button>
        ) : (
          <div className="mb-5"></div>
        )}
        <div className="row rounded-4">
          <div className="col mt-2 pt-2">
            {actualMain.showform ? renderForm() : renderList()}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Admin/PayPad"], PayPad);*/


/*
import "../pages.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withAuthorization from "../withAuthorization";
import FormPayPad from "./components/FormPayPad";
import PaypadCards from "./components/PayPadCards";
import { TitlePage } from "../../components/TitlePage";
import { usePaypadFunctionalities } from "./hooks/usePaypadFunctionalities";
import useModelFormat from "./hooks/useModelFormat";
import { usePreConfig } from "./hooks/usePreConfig";
import { Dialog } from "primereact/dialog";

const PayPad = () => {
  const [actualMain, setMainView] = useState({ showform: false, idToUpdate: null });
  const { refresh, paypads, offices } = usePreConfig();
  const { paypadInfoFormated, modalElement, buildModel, permissions } = useModelFormat();
  const functionalities = usePaypadFunctionalities(refresh, setMainView);
  const [dialogProperties, setDialogProperties] = useState({ visible: false, width: "50vw" });
  const [filterValue, setFilterValue] = useState(""); // Estado para el filtro por nombre

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (paypads !== null && offices !== null) buildModel(paypads, offices, functionalities, setMainView);
  }, [paypads, offices]);

  useEffect(() => {
    if (modalElement) {
      setDialogProperties({ visible: true, width: modalElement.type.name === "PayPadBalanceView" ? "90vw" : "60vw" });
    } else {
      setDialogProperties({ visible: false, width: "50vw" });
    }
  }, [modalElement]);

  // Filtrar paypadInfoFormated por la propiedad Nombre
  const filteredPaypads = paypadInfoFormated.filter((paypad) =>
    paypad.Nombre?.toLowerCase().includes(filterValue.toLowerCase())
  );

  const renderList = () => {
    return (
      <>
        {filteredPaypads.length > 0 ? (
          <PaypadCards data={filteredPaypads} />
        ) : (
          <div className="text-center mt-4">
            {filterValue ? (
              <div className="alert alert-info">
                <FontAwesomeIcon icon="fa-solid fa-info-circle" className="me-2" />
                {`No se encontraron Pay+ que coincidan con ${filterValue}`}
              </div>
            ) : (
              <div className="alert alert-secondary">
                <FontAwesomeIcon icon="fa-solid fa-exclamation-triangle" className="me-2" />
                No hay Pay+ disponibles
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderForm = () => {
    return (
      <FormPayPad
        createHandler={functionalities.createPaypad}
        editHandler={functionalities.updatePaypad}
        backHandler={functionalities.back}
        idToEdit={actualMain.idToUpdate}
      />
    );
  };

  return (
    <>
      <Dialog
        maximizable
        position="top"
        visible={dialogProperties.visible}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: dialogProperties.width }}
        onHide={() => setDialogProperties({ visible: false, width: "50vw" })}
      >
        {modalElement}
      </Dialog>
      <div className="p-4 w-100 h-100">
        <TitlePage title={"Pay+"} icon={"fa-solid fa-hand-holding-dollar"} />
        {permissions.filter((p) => p.name === "WritePayPads").length > 0 ? (
          <button
            className="btn btn-outline-success mx-3"
            onClick={() => {
              setMainView({ showform: true, idToUpdate: null });
            }}
          >
            <FontAwesomeIcon className="me-2" icon="fa-solid fa-money-check-dollar" />
            <span>Crear Pay+</span>
          </button>
        ) : (
          <div className="mb-5"></div>
        )}
        <div className="row mb-3">
          <div className="col-md-6 col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar Pay+ por nombre..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
        <div className="row rounded-4">
          <div className="col mt-2 pt-2">
            {actualMain.showform ? renderForm() : renderList()}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Admin/PayPad"], PayPad);*/

import "../pages.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withAuthorization from "../withAuthorization";
import FormPayPad from "./components/FormPayPad";
import PaypadCards from "./components/PayPadCards";
import { TitlePage } from "../../components/TitlePage";
import { usePaypadFunctionalities } from "./hooks/usePaypadFunctionalities";
import useModelFormat from "./hooks/useModelFormat";
import { usePreConfig } from "./hooks/usePreConfig";
import { Dialog } from "primereact/dialog";

const PayPad = () => {
  const [actualMain, setMainView] = useState({ showform: false, idToUpdate: null });
  const { refresh, paypads, offices } = usePreConfig();
  const { paypadInfoFormated, modalElement, buildModel, permissions } = useModelFormat();
  const functionalities = usePaypadFunctionalities(refresh, setMainView);
  const [dialogProperties, setDialogProperties] = useState({ visible: false, width: "50vw" });
  const [filterValue, setFilterValue] = useState(""); // Estado para el filtro por nombre

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (paypads !== null && offices !== null) buildModel(paypads, offices, functionalities, setMainView);
  }, [paypads, offices]);

  useEffect(() => {
    if (modalElement) {
      setDialogProperties({ visible: true, width: modalElement.type.name === "PayPadBalanceView" ? "90vw" : "60vw" });
    } else {
      setDialogProperties({ visible: false, width: "50vw" });
    }
  }, [modalElement]);

  // Filtrar paypadInfoFormated por la propiedad Nombre
  const filteredPaypads = paypadInfoFormated.filter((paypad) =>
    paypad.Nombre?.toLowerCase().includes(filterValue.toLowerCase())
  );

  const renderList = () => {
    return (
      <>
        {filteredPaypads.length > 0 ? (
          <PaypadCards data={filteredPaypads} />
        ) : (
          <div className="text-center mt-4">
            {filterValue ? (
              <div className="alert alert-info">
                <FontAwesomeIcon icon="fa-solid fa-info-circle" className="me-2" />
                {`No se encontraron Pay+ que coincidan con ${filterValue}`}
              </div>
            ) : (
              <div className="alert alert-secondary">
                <FontAwesomeIcon icon="fa-solid fa-exclamation-triangle" className="me-2" />
                No hay Pay+ disponibles
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderForm = () => {
    return (
      <FormPayPad
        createHandler={functionalities.createPaypad}
        editHandler={functionalities.updatePaypad}
        backHandler={functionalities.back}
        idToEdit={actualMain.idToUpdate}
      />
    );
  };

  return (
    <>
      <Dialog
        maximizable
        position="top"
        visible={dialogProperties.visible}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: dialogProperties.width }}
        onHide={() => setDialogProperties({ visible: false, width: "50vw" })}
      >
        {modalElement}
      </Dialog>
      <div className="p-4 w-100 h-100">
        <TitlePage title={"Pay+"} icon={"fa-solid fa-hand-holding-dollar"} />
        {permissions.filter((p) => p.name === "WritePayPads").length > 0 ? (
          <button
            className="btn btn-outline-success mx-3 mb-3"
            onClick={() => {
              setMainView({ showform: true, idToUpdate: null });
            }}
          >
            <FontAwesomeIcon className="me-2" icon="fa-solid fa-money-check-dollar" />
            <span>Crear Pay+</span>
          </button>
        ) : (
          <div className="mb-5"></div>
        )}
        {/* Campo de búsqueda por nombre, centrado y con ancho del contenedor */}
        <div className="container mb-3">
          <div className="row justify-content-center">
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar Pay+ por nombre..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row rounded-4">
          <div className="col mt-2 pt-2">
            {actualMain.showform ? renderForm() : renderList()}
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthorization(["/Admin/PayPad"], PayPad);