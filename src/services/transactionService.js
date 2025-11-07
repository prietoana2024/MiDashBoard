import axios from "axios";

const GENERAL_HEADERS = {
  // eslint-disable-next-line no-undef
  DashboardKeyId: process.env.REACT_APP_DKEYID,
};

/*
const getAll = () => {
  const token = window.localStorage.getItem('session');
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: 'Bearer ' + token },
  };
  return axios.get('/api/Transaction', config).then((responseObj) => {
    const { data } = responseObj;
    return data;
  });
};
*/
const getByIdsPaypadsAndDate = (dateRangeIdsDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };
  return axios
    .post("/api/Transaction/GetByDatePaypads", dateRangeIdsDto, config)
    .then((responseObj) => {
      const { data } = responseObj;
      return data;
    });
};



const getByIdPaypadAndDate = (dateRangeDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };
  return axios
    .post("/api/Transaction/GetByDate", dateRangeDto, config)
    .then((responseObj) => {
      const { data } = responseObj;
      console.log("Detalles de la transacción:", data);

      return data;
    });
};

const getDetailsByIdTransaction = (idTransaction) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };
  return axios
    .get("/api/Transaction/" + idTransaction + "/Details", config)
    .then((responseObj) => {
      const { data } = responseObj;
      console.log("Detalles de la transacción:", data);
      return data;
    });
};

const getExcelReport = (excelTransactionDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
    responseType: "blob"
  };
  return axios
    .post("/api/Transaction/ExcelDoc", excelTransactionDto, config).then(response => {
      const href = window.URL.createObjectURL(response.data);

      const anchorElement = document.createElement("a");

      anchorElement.href = href;
      anchorElement.download = excelTransactionDto.fileName;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    });
};

/*
const getExcelReportAll = (dateRangeIdsDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
    responseType: "blob"
  };
  //https://localhost:7137/api/Transaction/PostExcelDocAll

  return axios
    .post("/api/Transaction/PostExcelDocAll", dateRangeIdsDto, config).then(response => {
      console.log("📦 Respuesta recibida para el reporte Excel All:", response);
      const href = window.URL.createObjectURL(response.data);
      console.log("📦 Respuesta recibida para el reporte Excel All:", response);
      console.log("📦 Data:", response.data);

      const anchorElement = document.createElement("a");

      anchorElement.href = href;
      anchorElement.download = response.data;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    });
};*/
const getExcelReportAll = (dateRangeIdsDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
    responseType: "blob"
  };

  return axios
    .post("/api/Transaction/PostExcelDocAll", dateRangeIdsDto, config)
    .then(response => {
      console.log("📦 Respuesta recibida para el reporte Excel All:", response);
      
      // 🔥 CORRECCIÓN: Extraer el nombre del archivo desde los headers
      let fileName = "Reporte.xlsx"; // Nombre por defecto
      
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        // Extraer el nombre del archivo del header content-disposition
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
      }
      
      console.log("📄 Nombre del archivo:", fileName);
      
      // Crear el blob URL
      const href = window.URL.createObjectURL(response.data);
      
      // Crear elemento anchor y descargar
      const anchorElement = document.createElement("a");
      anchorElement.href = href;
      anchorElement.download = fileName; // 🔥 Usar el nombre extraído
      
      document.body.appendChild(anchorElement);
      anchorElement.click();
      
      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    });
};


const downloadVideo = (transactionInfoDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
    responseType: "blob"
  };
  const formatedPath = "/api/Transaction/Video?idTransaction=" + transactionInfoDto.idTransaction + "&idPaypad=" + transactionInfoDto.idPaypad;
  return axios
    .get(formatedPath, config).then(response => {
      const href = window.URL.createObjectURL(response.data);

      const anchorElement = document.createElement("a");

      anchorElement.href = href;
      anchorElement.download = "transaccion_" + transactionInfoDto.idTransaction + ".mp4";

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    });
};


export default { getByIdPaypadAndDate, getByIdsPaypadsAndDate, getDetailsByIdTransaction, getExcelReport, getExcelReportAll, downloadVideo };
