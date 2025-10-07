/*import React from "react";
import PropTypes from "prop-types";

export const TableCrud = ({ data, isEnumarated = true }) => {
  return (
    <div style={{ overflow: "auto" }}>
      <table className="table table-dark table-hover text-center">
        <thead>
          <tr>
            {isEnumarated ? (
              <th className="fw-bold" scope="col">
                #
              </th>
            ) : (
              <></>
            )}
            {Object.keys(data[0]).map((atribute, i) => {
              if (atribute !== "id") {
                return (
                  <th key={"header_" + i} scope="col">
                    {atribute}
                  </th>
                );
              }
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            return (
              <tr key={item.id}>
                {isEnumarated ? (
                  <th key={item.id + "_#"} scope="row">
                    {i + 1}
                  </th>
                ) : (
                  <></>
                )}
                {Object.keys(item).map((atribute, j) => {
                  if (atribute !== "id") {
                    return <th key={item.id + "_" + j}>{item[atribute]}</th>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableCrud.propTypes = {
  data: PropTypes.array,
  isEnumarated: PropTypes.bool,
};

export const TableCrudWithAdditionalInfo = ({ data, isEnumarated = true }) => {
  return (
    <div style={{ overflow: "auto" }}>
      <table className="table table-dark table-hover text-center">
        <thead>
          <tr>
            {isEnumarated ? (
              <th className="fw-bold" scope="col">
                #
              </th>
            ) : (
              <></>
            )}
            {Object.keys(data[0]).map((atribute, i) => {
              if (atribute !== "id" && atribute !== "additionalInfo") {
                return (
                  <th key={"header_" + i} scope="col">
                    {atribute}
                  </th>
                );
              }
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            return (
              <React.Fragment key={"body_" + item.id}>
                <tr
                  key={item.id}
                  data-bs-toggle="collapse"
                  data-bs-target={"#AdditionalInfo_" + item.id}
                  aria-expanded="false"
                  aria-controls={"AdditionalInfo_" + item.id}
                >
                  {isEnumarated ? (
                    <th key={item.id + "_#"} scope="row">
                      {i + 1}
                    </th>
                  ) : (
                    <></>
                  )}
                  {Object.keys(item).map((atribute, j) => {
                    if (atribute !== "id" && atribute !== "additionalInfo") {
                      return <th key={item.id + "_" + j}>{item[atribute]}</th>;
                    }
                  })}
                </tr>
                <tr key={"AdditionalInfo_" + item.id} id={"AdditionalInfo_" + item.id} className="collapse">
                  <td colSpan={Object.keys(item).length}>
                    {item.additionalInfo}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableCrudWithAdditionalInfo.propTypes = {
  data: PropTypes.array,
  isEnumarated: PropTypes.bool,
};
*/

/*
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";

export const TableCrud = ({ data, isEnumarated = true }) => {
  // Validación defensiva para evitar errores si data está vacío
  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar</div>;
  }

  return (
    <div style={{ overflow: "auto" }}>
      <table className="table table-dark table-hover text-center">
        <thead>
          <tr>
            {isEnumarated ? (
              <th className="fw-bold" scope="col">
                #
              </th>
            ) : (
              <></>
            )}
            {Object.keys(data[0]).map((atribute, i) => {
              if (atribute !== "id") {
                return (
                  <th key={"header_" + i} scope="col">
                    {atribute}
                  </th>
                );
              }
              return null; // Agregar return explícito
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            return (
              <tr key={item.id}>
                {isEnumarated ? (
                  <th key={item.id + "_#"} scope="row">
                    {i + 1}
                  </th>
                ) : (
                  <></>
                )}
                {Object.keys(item).map((atribute, j) => {
                  if (atribute !== "id") {
                    return <th key={item.id + "_" + j}>{item[atribute]}</th>;
                  }
                  return null; // Agregar return explícito
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableCrud.propTypes = {
  data: PropTypes.array.isRequired,
  isEnumarated: PropTypes.bool,
};

export const TableCrudWithAdditionalInfo = ({ data, isEnumarated = true, idPrefix }) => {
  const [openRowId, setOpenRowId] = useState(null);

  // Validación defensiva para evitar errores si data está vacío
  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar</div>;
  }

  // Función que maneja los clics en las filas
  const handleRowClick = (e, clickedRowId) => {
    // Prevenir la propagación del evento si se hizo clic en un botón u otro elemento interactivo
    if (e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.closest(".btn")) {
      return;
    }

    // Crear un ID único combinando el prefijo con el ID del item
    const uniqueId = `${idPrefix}_${clickedRowId}`;

    // Comprobamos si la fila en la que se hizo clic ya estaba abierta
    if (openRowId === uniqueId) {
      // Si es así, la cerramos
      setOpenRowId(null);
    } else {
      // Si no, la abrimos
      setOpenRowId(uniqueId);
    }
  };

  return (
    <div style={{ overflow: "auto" }}>
      <table className="table table-dark table-hover text-center">
        <thead>
          <tr>
            {isEnumarated ? (
              <th className="fw-bold" scope="col">
                #
              </th>
            ) : (
              <></>
            )}
            {Object.keys(data[0]).map((atribute, i) => {
              if (atribute !== "id" && atribute !== "additionalInfo") {
                return (
                  <th key={`${idPrefix}_header_${i}`} scope="col">
                    {atribute}
                  </th>
                );
              }
              return null; // Agregar return explícito
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            // Crear un ID único para esta fila específica
            const uniqueRowId = `${idPrefix}_${item.id}`;
            // Determinar si esta fila debe estar abierta
            const isRowOpen = openRowId === uniqueRowId;

            return (
              <React.Fragment key={`${idPrefix}_body_${item.id}`}>
                <tr
                  key={item.id}
                  onClick={(e) => handleRowClick(e, item.id)} // Pasar el evento
                  style={{ cursor: "pointer" }}
                  aria-expanded={isRowOpen}
                >
                  {isEnumarated ? (
                    <th key={item.id + "_#"} scope="row">
                      {i + 1}
                    </th>
                  ) : (
                    <></>
                  )}
                  {Object.keys(item).map((atribute, j) => {
                    if (atribute !== "id" && atribute !== "additionalInfo") {
                      return <th key={item.id + "_" + j}>{item[atribute]}</th>;
                    }
                    return null; // Agregar return explícito
                  })}
                </tr>

                <tr key={`additional_info_${item.id}`}>
                  <td colSpan={Object.keys(item).length} style={{ padding: 0, border: 0 }}>
                    <div className={`collapse ${isRowOpen ? "show" : ""}`}>
                      {item.additionalInfo}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableCrudWithAdditionalInfo.propTypes = {
  data: PropTypes.array.isRequired,
  isEnumarated: PropTypes.bool,
  idPrefix: PropTypes.string.isRequired,
};*/
import React from "react";
import PropTypes from "prop-types";

export const TableCrud = ({ data, isEnumarated = true }) => {
  return (
    <div style={{ overflow: "auto" }}>
      <table className="table table-dark table-hover text-center">
        <thead>
          <tr>
            {isEnumarated ? (
              <th className="fw-bold" scope="col">
                #
              </th>
            ) : (
              <></>
            )}
            {Object.keys(data[0]).map((atribute, i) => {
              if (atribute !== "id") {
                return (
                  <th key={"header_" + i} scope="col">
                    {atribute}
                  </th>
                );
              }
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            return (
              <tr key={item.id}>
                {isEnumarated ? (
                  <th key={item.id + "_#"} scope="row">
                    {i + 1}
                  </th>
                ) : (
                  <></>
                )}
                {Object.keys(item).map((atribute, j) => {
                  if (atribute !== "id") {
                    return <th key={item.id + "_" + j}>{item[atribute]}</th>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableCrud.propTypes = {
  data: PropTypes.array,
  isEnumarated: PropTypes.bool,
};

export const TableCrudWithAdditionalInfo = ({ data, isEnumarated = true }) => {
  return (
    <div style={{ overflow: "auto" }}>
      <table className="table table-dark table-hover text-center">
        <thead>
          <tr>
            {isEnumarated ? (
              <th className="fw-bold" scope="col">
                #
              </th>
            ) : (
              <></>
            )}
            {Object.keys(data[0]).map((atribute, i) => {
              if (atribute !== "id" && atribute !== "additionalInfo") {
                return (
                  <th key={"header_" + i} scope="col">
                    {atribute}
                  </th>
                );
              }
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            return (
              <React.Fragment key={"body_" + item.id}>
                <tr
                  key={item.id}
                  data-bs-toggle="collapse"
                  data-bs-target={"#AdditionalInfo_" + item.id}
                  aria-expanded="false"
                  aria-controls={"AdditionalInfo_" + item.id}
                >
                  {isEnumarated ? (
                    <th key={item.id + "_#"} scope="row">
                      {i + 1}
                    </th>
                  ) : (
                    <></>
                  )}
                  {Object.keys(item).map((atribute, j) => {
                    if (atribute !== "id" && atribute !== "additionalInfo") {
                      return <th key={item.id + "_" + j}>{item[atribute]}</th>;
                    }
                  })}
                </tr>
                <tr key={"AdditionalInfo_" + item.id} id={"AdditionalInfo_" + item.id} className="collapse">
                  <td colSpan={Object.keys(item).length}>
                    {item.additionalInfo}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

TableCrudWithAdditionalInfo.propTypes = {
  data: PropTypes.array,
  isEnumarated: PropTypes.bool,
};
