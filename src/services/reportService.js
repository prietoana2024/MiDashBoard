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
  return axios.get('/api/Payer', config).then((responseObj) => {
    const { data } = responseObj;
    return data;
  });
};*/

const getByIdPaypadAndDate = (dateRangeDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };
  return axios
    .post("/api/Payer/GetByPaypadDate", dateRangeDto, config)
    .then((responseObj) => {
      console.log(responseObj);
      const { data } = responseObj;
      
      // Map the response data to your reportDto format
      if (data && data.response && Array.isArray(data.response)) {
        // Transform each item in the response array to match your reportDto structure
        const mappedData = data.response.map(item => {
          return {
            id: item.id || 0,
            document: item.document || null,
            documenttype: item.documenT_TYPE || null,
            name: item.name || null,
            lastName: item.lastname || null,
            nacionality: null, // Not present in API response
            birthday: null, // Not present in API response
            phone: item.phone || null,
            email: item.email || null,
            adress: null, // Not present in API response
            departament: null, // Not present in API response
            municipality: null, // Not present in API response
            state: item.iD_STATE_TRANSACTION || 0,
            idtransaction: item.iD_TRANSACTION || 0,
            idClient: 0, // Not present in API response
            client: null, // Not present in API response
            idUserCreated: item.idUserCreated || 0,
            userCreated: item.userCreated || null,
            idUserUpdated: item.idUserUpdated || 0,
            userUpdated: item.userUpdated || null,
            dateCreated: item.datE_CREATED || null
          };
        });
        
        return mappedData;
      }
      console.log(data);
      return data;
    });
};
/*
const getByIdPaypadAndDate = (dateRangeDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };
  return axios
    .post("/api/Payer/GetByPaypadDate", dateRangeDto, config)
    .then((responseObj) => {
      console.log(responseObj);
      const { data } = responseObj;
      return data;
    });
};*/

const getDetailsByIdTransaction = (idTransaction) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };
  return axios
    .get("/api/Transaction/"+idTransaction+"/Details", config)
    .then((responseObj) => {
      const { data } = responseObj;
      return data;
    });
};

const getExcelReport = (excelTransactionDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token},
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

const downloadVideo = (transactionInfoDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token},
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

export default { getByIdPaypadAndDate,getDetailsByIdTransaction,getExcelReport,downloadVideo };