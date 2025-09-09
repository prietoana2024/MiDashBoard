/*import "../../pages.css";
import withAuthorization from "../../withAuthorization";
import SelectPayPad from "../shared/SelectPayPad";
import useFormDate from "../shared/hooks/useFormDate";
import FormDate from "../shared/FormDate";
import useSelectPayPad from "../shared/hooks/useSelectPayPad";
import { TitlePage } from "../../../components/TitlePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportsTable } from "./components/ReportsTable";
import useReport from "../shared/hooks/useReport";
import PropTypes from "prop-types";
import reportService from "../../../services/reportService";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState } from "react";


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

// Hardcoded list of procedures 
const PROCEDURES = ["Certificado de Registro mercantil", "Registro mercantíl del establecimiento","Certificado de Existencia y Representación Legal","Certificado de cancelación","Certificado de libros","Certificado Registro Único de Proponentes","Apoderados judiciales","Certificado especial de compraventa","Certificado especial de liquidación de personas jurídicas", "Todos"];

// Componente de selección de trámite
const SelectProcedure = ({ procedures, handleProcedureChange, selectedProcedure }) => {
  return (
    <div className="form-group">
      <label htmlFor="procedure" className="form-label">Trámite</label>
      <select
        className="form-select"
        id="procedure"
        value={selectedProcedure || ""}
        onChange={(e) => handleProcedureChange(e.target.value)}
      >
        <option value="">Seleccione un trámite</option>
        {procedures.map((procedure, index) => (
          <option key={index} value={procedure}>
            {procedure}
          </option>
        ))}
      </select>
    </div>
  );
};

// PropTypes para el componente SelectProcedure
SelectProcedure.propTypes = {
  procedures: PropTypes.array.isRequired,
  handleProcedureChange: PropTypes.func.isRequired,
  selectedProcedure: PropTypes.string,
};

// Hook para select de trámite
const useSelectProcedure = () => {
  const [selectedProcedure, setSelectedProcedure] = useState("Todos");

  const handleProcedureChange = (procedure) => {
    setSelectedProcedure(procedure);
  };

  return [selectedProcedure, handleProcedureChange];
};

const Reports = () => {
  const { paypads, selectedPaypad, handleChangePaypad } = useSelectPayPad(true);
  const { dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo } = useFormDate();
  const { reportsTable, refresh, refreshProduct } = useReport(dateRange, selectedPaypad);

  // Estados para trámites
  const [procedures] = useState(PROCEDURES); // Use hardcoded procedures
  const [selectedProcedure, handleProcedureChange] = useSelectProcedure();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (dateRange === null) return;
    if (selectedProcedure === "Todos" || !selectedProcedure) {
      refresh(); // Fetch all reports when "Todos" or no procedure is selected
    } else {
      refreshProduct(selectedProcedure); // Fetch reports for specific procedure
    }
  }, [dateRange, selectedProcedure]);

  const requestExcel = () => {
    if (dateRange.from == undefined || dateRange.to == undefined) return;

    // Usar las transacciones filtradas para el Excel
    let body = {
      transactionIds: reportsTable.map(t => t.id),
      paypadId: selectedPaypad.id,
      fileName: `Reporte_${selectedPaypad.username}_${formatDate(dateRange.from)}_a_${formatDate(dateRange.to)}.xlsx`.replace(" ", "")
    };

    reportService.getExcelReport(body).catch(async ({ response }) => {
      let [, errMsg] = await handleHttpError(response);
      errMsg = "Ocurrio un error generando el archivo.";
      Swal.fire({
        text: errMsg,
        icon: "error",
      });
      return;
    });
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
    <div className="p-4 w-100 h-100">
      <TitlePage title={"reportes"} icon={"fa-solid fa-money-check-dollar"}></TitlePage>
      <div
        className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
        style={{ marginBottom: "3rem", paddingLeft: "5rem", paddingRight: "5rem", paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <b>Parametros de busqueda</b>
        <div className="row">
          <div className="col-6">
            <SelectPayPad
              paypads={paypads ? paypads : []}
              paypadSelected={selectedPaypad}
              handleChangePaypad={handleChangePaypad}
              showAllPayPads={true}
            />
          </div>
          <div className="col-6" style={{ borderLeft: "solid", alignSelf: "center" }}>
            <FormDate
              handleSubmitDate={handleSubmitDate}
              dateFrom={dateTimeFrom}
              dateTo={dateTimeTo}
              setDateFrom={setDateTimeFrom}
              setDateTo={setDateTimeTo}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-2" style={{ textAlign: "end" }}>
            <button className="btn btn-outline-success" onClick={handleSubmitDate}>
              <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{ marginRight: "1rem" }} />
              Consultar
            </button>
          </div>
        </div>
        <b>Reportar por:</b>
        <div className="row">
          <div className="col-6">
            <SelectProcedure
              procedures={procedures}
              handleProcedureChange={handleProcedureChange}
              selectedProcedure={selectedProcedure}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-2 bg-dark rounded-4 overflow-auto">
        {reportsTable.length <= 0 ? "" : <Toolbar start={startContent}></Toolbar>}
        <ReportsTable reportsTable={reportsTable} dateRange={dateRange} showDetailed={false}></ReportsTable>
      </div>
    </div>
  );
};

export default withAuthorization(["/Reports"], Reports);*/
/*
import "../../pages.css";
import withAuthorization from "../../withAuthorization";
import SelectPayPad from "../shared/SelectPayPad";
import useFormDate from "../shared/hooks/useFormDate";
import FormDate from "../shared/FormDate";
import useSelectPayPad from "../shared/hooks/useSelectPayPad";
import { TitlePage } from "../../../components/TitlePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportsTable } from "./components/ReportsTable";
import useReport from "../shared/hooks/useReport";
import PropTypes from "prop-types";
import reportService from "../../../services/reportService";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState, useMemo } from "react";

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

// Hardcoded list of procedures 
const PROCEDURES = ["Registro","Certificado de Registro mercantil", "Registro mercantíl del establecimiento","Certificado de Existencia y Representación Legal","Certificado de cancelación","Certificado de libros","Certificado Registro Único de Proponentes","Apoderados judiciales","Certificado especial de compraventa","Certificado especial de liquidación de personas jurídicas", "Todos"];

// Función para verificar si un trámite contiene el procedimiento seleccionado
const procedureMatches = (tramiteValue, selectedProcedure) => {
  // Si no hay procedimiento seleccionado o es "Todos", mostrar todo
  if (!selectedProcedure || selectedProcedure === "Todos") {
    return true;
  }
  
  // Si tramiteValue es null o undefined, no coincide
  if (!tramiteValue) {
    return false;
  }
  
  // Convertir a string por seguridad
  const tramiteStr = String(tramiteValue);
  
  // Si contiene comas, separar y verificar cada uno
  if (tramiteStr.includes(",")) {
    const procedimientos = tramiteStr.split(",").map(p => p.trim());
    return procedimientos.some(proc => 
      proc.toLowerCase().includes(selectedProcedure.toLowerCase()) ||
      selectedProcedure.toLowerCase().includes(proc.toLowerCase())
    );
  }
  
  // Verificación simple para un solo procedimiento
  return tramiteStr.toLowerCase().includes(selectedProcedure.toLowerCase()) ||
         selectedProcedure.toLowerCase().includes(tramiteStr.toLowerCase());
};

// Componente de selección de trámite
const SelectProcedure = ({ procedures, handleProcedureChange, selectedProcedure }) => {
  return (
    <div className="form-group">
      <label htmlFor="procedure" className="form-label">Trámite</label>
      <select
        className="form-select"
        id="procedure"
        value={selectedProcedure || ""}
        onChange={(e) => handleProcedureChange(e.target.value)}
      >
        <option value="">Seleccione un trámite</option>
        {procedures.map((procedure, index) => (
          <option key={index} value={procedure}>
            {procedure}
          </option>
        ))}
      </select>
    </div>
  );
};

// PropTypes para el componente SelectProcedure
SelectProcedure.propTypes = {
  procedures: PropTypes.array.isRequired,
  handleProcedureChange: PropTypes.func.isRequired,
  selectedProcedure: PropTypes.string,
};

// Hook para select de trámite
const useSelectProcedure = () => {
  const [selectedProcedure, setSelectedProcedure] = useState("Todos");

  const handleProcedureChange = (procedure) => {
    setSelectedProcedure(procedure);
  };

  return [selectedProcedure, handleProcedureChange];
};

const Reports = () => {
  const { paypads, selectedPaypad, handleChangePaypad } = useSelectPayPad(true);
  const { dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo } = useFormDate();
  const { reportsTable, refresh, refreshProduct } = useReport(dateRange, selectedPaypad);

  // Estados para trámites
  const [procedures] = useState(PROCEDURES);
  const [selectedProcedure, handleProcedureChange] = useSelectProcedure();
  const [allReports, setAllReports] = useState([]); // Guardar todos los reportes

  // Filtrar reportes basado en el procedimiento seleccionado
  const filteredReports = useMemo(() => {
    if (!allReports || allReports.length === 0) {
      return reportsTable;
    }
    
    if (!selectedProcedure || selectedProcedure === "Todos") {
      return allReports;
    }
    
    return allReports.filter(report => 
      procedureMatches(report.Trámite || report.tramite || report.Tramite, selectedProcedure)
    );
  }, [allReports, selectedProcedure, reportsTable]);

  useEffect(() => {
    refresh();
  }, []);

  // Actualizar allReports cuando reportsTable cambie
  useEffect(() => {
    if (reportsTable && reportsTable.length > 0) {
      setAllReports(reportsTable);
    }
  }, [reportsTable]);

  useEffect(() => {
    if (dateRange === null) return;
    // Solo hacer refresh, el filtrado se maneja en el useMemo
    refresh();
  }, [dateRange]);

  const requestExcel = () => {
    if (dateRange.from == undefined || dateRange.to == undefined) return;

    // Usar las transacciones filtradas para el Excel
    let body = {
      transactionIds: filteredReports.map(t => t.id),
      paypadId: selectedPaypad.id,
      fileName: `Reporte_${selectedPaypad.username}_${formatDate(dateRange.from)}_a_${formatDate(dateRange.to)}.xlsx`.replace(" ", "")
    };

    reportService.getExcelReport(body).catch(async ({ response }) => {
      let [, errMsg] = await handleHttpError(response);
      errMsg = "Ocurrio un error generando el archivo.";
      Swal.fire({
        text: errMsg,
        icon: "error",
      });
      console.log(refreshProduct);
      return;
    });
  };

  const startContent = (
    <React.Fragment>
      <button className="btn btn-outline-success"
        onClick={requestExcel}>
        <FontAwesomeIcon icon={"fa-solid fa-file-excel"} className="ms-2" style={{ marginRight: "1rem" }} />
        Excel
      </button>
      {selectedProcedure && selectedProcedure !== "Todos" && (
        <span className="badge bg-info ms-2" style={{ fontSize: "14px", padding: "8px 12px" }}>
          Filtrado por: {selectedProcedure} ({filteredReports.length} resultados)
        </span>
      )}
    </React.Fragment>
  );

  return (
    <div className="p-4 w-100 h-100">
      <TitlePage title={"reportes"} icon={"fa-solid fa-money-check-dollar"}></TitlePage>
      <div
        className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
        style={{ marginBottom: "3rem", paddingLeft: "5rem", paddingRight: "5rem", paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <b>Parametros de busqueda</b>
        <div className="row">
          <div className="col-6">
            <SelectPayPad
              paypads={paypads ? paypads : []}
              paypadSelected={selectedPaypad}
              handleChangePaypad={handleChangePaypad}
              showAllPayPads={true}
            />
          </div>
          <div className="col-6" style={{ borderLeft: "solid", alignSelf: "center" }}>
            <FormDate
              handleSubmitDate={handleSubmitDate}
              dateFrom={dateTimeFrom}
              dateTo={dateTimeTo}
              setDateFrom={setDateTimeFrom}
              setDateTo={setDateTimeTo}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-2" style={{ textAlign: "end" }}>
            <button className="btn btn-outline-success" onClick={handleSubmitDate}>
              <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{ marginRight: "1rem" }} />
              Consultar
            </button>
          </div>
        </div>
        <b>Reportar por:</b>
        <div className="row">
          <div className="col-6">
            <SelectProcedure
              procedures={procedures}
              handleProcedureChange={handleProcedureChange}
              selectedProcedure={selectedProcedure}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-2 bg-dark rounded-4 overflow-auto">
        {filteredReports.length <= 0 ? "" : <Toolbar start={startContent}></Toolbar>}
        <ReportsTable reportsTable={filteredReports} dateRange={dateRange} showDetailed={false}></ReportsTable>
      </div>
    </div>
  );
};

export default withAuthorization(["/Reports"], Reports);*/

import "../../pages.css";
import withAuthorization from "../../withAuthorization";
import SelectPayPad from "../shared/SelectPayPad";
import useFormDate from "../shared/hooks/useFormDate";
import FormDate from "../shared/FormDate";
import useSelectPayPad from "../shared/hooks/useSelectPayPad";
import { TitlePage } from "../../../components/TitlePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportsTable } from "./components/ReportsTable";
import useReport from "../shared/hooks/useReport";
import PropTypes from "prop-types";
import reportService from "../../../services/reportService";
import { handleHttpError } from "../../../errorHandling/errorHandler";
import Swal from "sweetalert2";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useState, useMemo } from "react";

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

// Hardcoded list of procedures 
const PROCEDURES = ["Certificado de Registro mercantil", "Registro mercantíl del establecimiento","Certificado de Existencia y Representación Legal","Certificado de cancelación","Certificado de libros","Certificado Registro Único de Proponentes","Apoderados judiciales","Certificado especial de compraventa","Certificado especial de liquidación de personas jurídicas", "Todos"];

// Función para verificar si un trámite coincide exactamente con el procedimiento seleccionado
const procedureMatches = (tramiteValue, selectedProcedure) => {
  // Si no hay procedimiento seleccionado o es "Todos", mostrar todo
  if (!selectedProcedure || selectedProcedure === "Todos") {
    return true;
  }
  
  // Si tramiteValue es null o undefined, no coincide
  if (!tramiteValue) {
    return false;
  }
  
  // Convertir a string por seguridad
  const tramiteStr = String(tramiteValue);
  
  // Si contiene comas, separar y verificar cada uno con coincidencia exacta
  if (tramiteStr.includes(",")) {
    const procedimientos = tramiteStr.split(",").map(p => p.trim());
    return procedimientos.some(proc => 
      proc.toLowerCase() === selectedProcedure.toLowerCase()
    );
  }
  
  // Verificación exacta para un solo procedimiento
  return tramiteStr.trim().toLowerCase() === selectedProcedure.toLowerCase();
};

// Componente de selección de trámite
const SelectProcedure = ({ procedures, handleProcedureChange, selectedProcedure }) => {
  return (
    <div className="form-group">
      <label htmlFor="procedure" className="form-label">Trámite</label>
      <select
        className="form-select"
        id="procedure"
        value={selectedProcedure || ""}
        onChange={(e) => handleProcedureChange(e.target.value)}
      >
        <option value="">Seleccione un trámite</option>
        {procedures.map((procedure, index) => (
          <option key={index} value={procedure}>
            {procedure}
          </option>
        ))}
      </select>
    </div>
  );
};

// PropTypes para el componente SelectProcedure
SelectProcedure.propTypes = {
  procedures: PropTypes.array.isRequired,
  handleProcedureChange: PropTypes.func.isRequired,
  selectedProcedure: PropTypes.string,
};

// Hook para select de trámite
const useSelectProcedure = () => {
  const [selectedProcedure, setSelectedProcedure] = useState("Todos");

  const handleProcedureChange = (procedure) => {
    setSelectedProcedure(procedure);
  };

  return [selectedProcedure, handleProcedureChange];
};

const Reports = () => {
  const { paypads, selectedPaypad, handleChangePaypad } = useSelectPayPad(true);
  const { dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo } = useFormDate();
  const { reportsTable, refresh, refreshProduct } = useReport(dateRange, selectedPaypad);

  // Estados para trámites
  const [procedures] = useState(PROCEDURES);
  const [selectedProcedure, handleProcedureChange] = useSelectProcedure();
  const [allReports, setAllReports] = useState([]); // Guardar todos los reportes

  // Filtrar reportes basado en el procedimiento seleccionado
  const filteredReports = useMemo(() => {
    if (!allReports || allReports.length === 0) {
      return reportsTable;
    }
    
    if (!selectedProcedure || selectedProcedure === "Todos") {
      return allReports;
    }
    
    return allReports.filter(report => 
      procedureMatches(report.Trámite || report.tramite || report.Tramite, selectedProcedure)
    );
  }, [allReports, selectedProcedure, reportsTable]);

  useEffect(() => {
    refresh();
  }, []);

  // Actualizar allReports cuando reportsTable cambie
  useEffect(() => {
    if (reportsTable && reportsTable.length > 0) {
      setAllReports(reportsTable);
    }
  }, [reportsTable]);

  useEffect(() => {
    if (dateRange === null) return;
    // Solo hacer refresh, el filtrado se maneja en el useMemo
    refresh();
  }, [dateRange]);

  const requestExcel = () => {
    if (dateRange.from == undefined || dateRange.to == undefined) return;

    // Usar las transacciones filtradas para el Excel
    let body = {
      transactionIds: filteredReports.map(t => t.id),
      paypadId: selectedPaypad.id,
      fileName: `Reporte_${selectedPaypad.username}_${formatDate(dateRange.from)}_a_${formatDate(dateRange.to)}.xlsx`.replace(" ", "")
    };

    reportService.getExcelReport(body).catch(async ({ response }) => {
      let [, errMsg] = await handleHttpError(response);
      console.log(refreshProduct);
      errMsg = "Ocurrio un error generando el archivo.";
      Swal.fire({
        text: errMsg,
        icon: "error",
      });
      return;
    });
  };

  const startContent = (
    <React.Fragment>
      <button className="btn btn-outline-success"
        onClick={requestExcel}>
        <FontAwesomeIcon icon={"fa-solid fa-file-excel"} className="ms-2" style={{ marginRight: "1rem" }} />
        Excel
      </button>
      {selectedProcedure && selectedProcedure !== "Todos" && (
        <span className="badge bg-info ms-2" style={{ fontSize: "14px", padding: "8px 12px" }}>
          Filtrado por: {selectedProcedure} ({filteredReports.length} resultados)
        </span>
      )}
    </React.Fragment>
  );

  return (
    <div className="p-4 w-100 h-100">
      <TitlePage title={"reportes"} icon={"fa-solid fa-money-check-dollar"}></TitlePage>
      <div
        className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
        style={{ marginBottom: "3rem", paddingLeft: "5rem", paddingRight: "5rem", paddingTop: "2rem", paddingBottom: "2rem" }}
      >
        <b>Parametros de busqueda</b>
        <div className="row">
          <div className="col-6">
            <SelectPayPad
              paypads={paypads ? paypads : []}
              paypadSelected={selectedPaypad}
              handleChangePaypad={handleChangePaypad}
              showAllPayPads={true}
            />
          </div>
          <div className="col-6" style={{ borderLeft: "solid", alignSelf: "center" }}>
            <FormDate
              handleSubmitDate={handleSubmitDate}
              dateFrom={dateTimeFrom}
              dateTo={dateTimeTo}
              setDateFrom={setDateTimeFrom}
              setDateTo={setDateTimeTo}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-2" style={{ textAlign: "end" }}>
            <button className="btn btn-outline-success" onClick={handleSubmitDate}>
              <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{ marginRight: "1rem" }} />
              Consultar
            </button>
          </div>
        </div>
        <b>Reportar por:</b>
        <div className="row">
          <div className="col-6">
            <SelectProcedure
              procedures={procedures}
              handleProcedureChange={handleProcedureChange}
              selectedProcedure={selectedProcedure}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid pt-2 bg-dark rounded-4 overflow-auto">
        {filteredReports.length <= 0 ? "" : <Toolbar start={startContent}></Toolbar>}
        <ReportsTable reportsTable={filteredReports} dateRange={dateRange} showDetailed={false}></ReportsTable>
      </div>
    </div>
  );
};

export default withAuthorization(["/Reports"], Reports);