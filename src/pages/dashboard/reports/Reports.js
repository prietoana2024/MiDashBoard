/*import "../../pages.css";
import {React, useEffect, useState} from "react";
import withAuthorization from "../../withAuthorization";
import SelectPayPad from "../shared/SelectPayPad";
import useFormDate from "../shared/hooks/useFormDate";
import FormDate from "../shared/FormDate";
import useSelectPayPad from "../shared/hooks/useSelectPayPad";
import SelectProduct from "../shared/SelectProduct";
import useSelectProduct from "../shared/hooks/useSelectProduct";
import {TitlePage} from "../../../components/TitlePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportsTable } from "./components/ReportsTable";
import useReport from "../shared/hooks/useReport";

const Reports = () => {
  const {paypads, selectedPaypad, handleChangePaypad} = useSelectPayPad(true);
  const {dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo} = useFormDate();
  const { reportsTable, refresh, initialReports, setReports} = useReport(dateRange, selectedPaypad);
  const [products, setProducts] = useState([]);
  const [selectedProduct, handleProductChange] = useSelectProduct(products);

  useEffect(() => {
    refresh();
  }, []);


  useEffect(() => {
    if (dateRange === null) return;
    refresh();
  }, [dateRange]);

  useEffect(()=>{
    let products = initialReports.map(tr => tr.product);
    if(products.length > 0)products.push("Todos");
    setProducts([... new Set(products)]);
  }, [initialReports]);

  useEffect(()=>{
    if(selectedProduct == "Todos"){
      setReports([...initialReports]);
      return;
    }
    setReports([...initialReports.filter(tr => tr.product == selectedProduct)]);
  }, [selectedProduct]);

  return (
    <div className="p-4 w-100 h-100">
      <TitlePage title={"reportes"} icon={"fa-solid fa-money-check-dollar"}></TitlePage>
      <div className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
        style={{marginBottom: "3rem", paddingLeft: "5rem", paddingRight: "5rem", paddingTop: "2rem", paddingBottom: "2rem"}}>
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
          <div className="col-6" style={{borderLeft: "solid", alignSelf: "center"}}>
            <FormDate handleSubmitDate={handleSubmitDate}
              dateFrom={dateTimeFrom}
              dateTo={dateTimeTo}
              setDateFrom={setDateTimeFrom}
              setDateTo={setDateTimeTo}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-2" style={{textAlign: "end"}}>
            <button className="btn btn-outline-success" onClick={handleSubmitDate}>
              <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{marginRight: "1rem"}}/>
              Consultar
            </button>
          </div> 
        </div>
        <b>Reportar por:</b>
        <div className="row">
          <div className="col-6">
            <SelectProduct
              products={products}
              handleProductChange={handleProductChange}
              selectedProduct={selectedProduct}></SelectProduct>
          </div>
        </div>
      </div>
      <div className="container-fluid pt-2 bg-dark rounded-4  overflow-auto">
        <ReportsTable reportsTable = {reportsTable} dateRange = {dateRange}  showDetailed = {false}></ReportsTable>
      </div>
    </div>
  );
};

export default withAuthorization(["/Reports"], Reports);*/

import "../../pages.css";
import {React, useEffect, useState} from "react";
import withAuthorization from "../../withAuthorization";
import SelectPayPad from "../shared/SelectPayPad";
import useFormDate from "../shared/hooks/useFormDate";
import FormDate from "../shared/FormDate";
import useSelectPayPad from "../shared/hooks/useSelectPayPad";
import {TitlePage} from "../../../components/TitlePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportsTable } from "./components/ReportsTable";
import useReport from "../shared/hooks/useReport";
import PropTypes from "prop-types";

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
  selectedProcedure: PropTypes.string
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
  const {paypads, selectedPaypad, handleChangePaypad} = useSelectPayPad(true);
  const {dateRange, handleSubmitDate, dateTimeFrom, dateTimeTo, setDateTimeFrom, setDateTimeTo} = useFormDate();
  const { reportsTable, refresh, initialReports, setReports} = useReport(dateRange, selectedPaypad);
  
  // Estados para trámites
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedure, handleProcedureChange] = useSelectProcedure();

  useEffect(() => {
    refresh();
  }, []);
  
  useEffect(() => {
    if (dateRange === null) return;
    refresh();
  }, [dateRange]);

  useEffect(() => {
    // Extraer todos los trámites únicos de los reportes
    let extractedProcedures = initialReports.map(tr => tr.procedure);
    if (extractedProcedures.length > 0) extractedProcedures.push("Todos");
    setProcedures([... new Set(extractedProcedures)]);
  }, [initialReports]);

  useEffect(() => {
    if (selectedProcedure === "Todos") {
      setReports([...initialReports]);
      return;
    }
    setReports([...initialReports.filter(tr => tr.procedure === selectedProcedure)]);
  }, [selectedProcedure, initialReports]);

  return (
    <div className="p-4 w-100 h-100">
      <TitlePage title={"reportes"} icon={"fa-solid fa-money-check-dollar"}></TitlePage>
      <div className="container-fluid mb-6 justify-content-start bg-dark rounded-4"
        style={{marginBottom: "3rem", paddingLeft: "5rem", paddingRight: "5rem", paddingTop: "2rem", paddingBottom: "2rem"}}>
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
          <div className="col-6" style={{borderLeft: "solid", alignSelf: "center"}}>
            <FormDate handleSubmitDate={handleSubmitDate}
              dateFrom={dateTimeFrom}
              dateTo={dateTimeTo}
              setDateFrom={setDateTimeFrom}
              setDateTo={setDateTimeTo}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-2" style={{textAlign: "end"}}>
            <button className="btn btn-outline-success" onClick={handleSubmitDate}>
              <FontAwesomeIcon icon={"fa-solid fa-search"} className="ms-2" style={{marginRight: "1rem"}}/>
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
        <ReportsTable reportsTable={reportsTable} dateRange={dateRange} showDetailed={false}></ReportsTable>
      </div>
    </div>
  );
};

export default withAuthorization(["/Reports"], Reports);

