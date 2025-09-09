import "../../../pages.css";
import React from "react";
import SearchingInfo from "../../../../components/SearchingInfo";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import BasicStringBuilder from "../../../../components/BasicPrimeTemplates/BasicStringBuilder";
import BasicContainerBuilder from "../../../../components/BasicPrimeTemplates/BasicContainerBuilder";

const ReportsTable = ({ reportsTable, dateRange, showDetailed = true }) => {

  // Template personalizado para el Estado que mantiene el styling
  const estadoBodyTemplate = (rowData) => {
    // Si ya viene como componente React, lo renderiza directamente
    if (React.isValidElement(rowData.Estado)) {
      return rowData.Estado;
    }
    // Si viene como string, lo renderiza con el mismo estilo que StateLabel
    return (
      <span className="state-label" style={{
        backgroundColor: "#28a745", // Verde como el StateLabel
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "15px",
        fontWeight: "bold"
      }}>
        {rowData.Estado}
      </span>
    );
  };

  const renderList = () => {
    return (
      <div className="">
        {reportsTable.length > 0 ? (
          <>
            <DataTable selectionMode="single" value={reportsTable} paginator rows={5}
              tableStyle={{ minHeight: "30rem" }} rowsPerPageOptions={[5, 10, 25, 50]}>
              <Column body={BasicStringBuilder("ID")} header="ID" ></Column>
              <Column body={BasicStringBuilder("Referencia")} header="Referencia" ></Column>
              <Column body={BasicStringBuilder("Fecha")} header="Fecha" ></Column>
              <Column body={BasicStringBuilder("Total")} header="Total" ></Column>
              <Column body={BasicStringBuilder("Tipo de Documento")} header="Tipo de Documento" ></Column>
              <Column body={BasicStringBuilder("Documento")} header="Documento" ></Column>
              <Column body={BasicStringBuilder("Nombres")} header="Nombres" ></Column>
              <Column body={BasicStringBuilder("Apellidos")} header="Apellidos" ></Column>
              <Column body={BasicStringBuilder("Celular")} header="Celular" ></Column>
              <Column body={BasicStringBuilder("Email")} header="Email" ></Column>
              <Column body={BasicStringBuilder("Trámite")} header="Trámite" ></Column>
              <Column body={BasicStringBuilder("Tipo")} header="Tipo" ></Column>
              <Column header="Estado" body={estadoBodyTemplate}></Column>

              {showDetailed ? <Column header="Accion" body={BasicContainerBuilder("Accion")}></Column> : ""}
            </DataTable>
          </>
        ) : (
          dateRange ? <SearchingInfo msg="Resultados no encontrados"></SearchingInfo> : <SearchingInfo msg="Seleccione los criterios de búsqueda"></SearchingInfo>
        )}
      </div>
    );
  };

  return renderList();
};
//            <Column header="Estado" body={BasicContainerBuilder("Estado")}></Column>

export { ReportsTable };

