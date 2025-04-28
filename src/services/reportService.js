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

  // Helper function
  function getProperty(item, propNames, defaultValue = null) {
    for (const prop of propNames) {
      if (item[prop] !== undefined && item[prop] !== null) {
        return item[prop];
      }
    }
    return defaultValue;
  }

  return axios
    .post("/api/Payer/GetByPaypadDate", dateRangeDto, config)
    .then((responseObj) => {
      console.log(responseObj);
      const { data } = responseObj;

      if (data && data.response && Array.isArray(data.response)) {
        const mappedData = data.response.map(item => {
          return {
            id: getProperty(item, ["id", "ID"], 0),
            referencia: getProperty(item, ["reference", "REFERENCE"]),
            document: getProperty(item, ["document", "DOCUMENT"]),
            documenttype: getProperty(item, ["documenttype", "documenT_TYPE", "DOCUMENT_TYPE"]),
            name: getProperty(item, ["name", "NAME"]),
            lastName: getProperty(item, ["lastName", "lastname", "LASTNAME"]),
            nacionality: getProperty(item, ["nacionality", "NACIONALITY"]),
            birthday: getProperty(item, ["birthday", "BIRTHDAY"]),
            phone: getProperty(item, ["phone", "PHONE"]),
            email: getProperty(item, ["email", "EMAIL"]),
            municipality: getProperty(item, ["municipality", "MUNICIPALITY"]),
            state: getProperty(item, ["state", "STATE", "iD_STATE_TRANSACTION", "ID_STATE_TRANSACTION"], 0),
            idtransaction: getProperty(item, ["idtransaction", "iD_TRANSACTION", "ID_TRANSACTION"], 0),
            idClient: getProperty(item, ["idClient", "idclient", "ID_CLIENT"], 0),
            client: getProperty(item, ["client", "CLIENT"]),
            idUserCreated: getProperty(item, ["idUserCreated", "iD_USER_CREATED", "ID_USER_CREATE"], 0),
            userCreated: getProperty(item, ["userCreated", "USER_CREATED"]),
            idUserUpdated: getProperty(item, ["idUserUpdated", "iD_USER_UPDATED", "ID_USER_UPDATED"], 0),
            userUpdated: getProperty(item, ["userUpdated", "USER_UPDATED"]),
            dateCreated: getProperty(item, ["dateCreated", "datE_CREATED", "DATE_CREATED"]),
            product: getProperty(item, ["product", "PRODUCT"]),
            paymenttype: getProperty(item, ["iD_TYPE_PAYMENT", "ID_TYPE_PAYMENT", "paymenttype"]),
            total: getProperty(item, ["totaL_AMOUNT", "TOTAL_AMOUNT", "total"]),
          };
        });

        return mappedData;
      }
      console.log(data);
      return data;
    });
};


const getByIdPaypadAndDateProduct = (dateRangeDto) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: "Bearer " + token },
  };

  function getProperty(item, propNames, defaultValue = null) {
    for (const prop of propNames) {
      if (item[prop] !== undefined && item[prop] !== null) {
        return item[prop];
      }
    }
    return defaultValue;
  }

  return axios
    .post("/api/Payer/GetByPaypadDateProduct", dateRangeDto, config)
    .then((responseObj) => {
      console.log(responseObj);
      const { data } = responseObj;

      if (data && data.response && Array.isArray(data.response)) {
        const mappedData = data.response.map((item) => {
          return {
            id: getProperty(item, ["id", "ID"], 0),
            referencia: getProperty(item, ["reference", "REFERENCE"]),
            document: getProperty(item, ["document", "DOCUMENT"]),
            documenttype: getProperty(item, ["documenttype", "documenT_TYPE", "DOCUMENT_TYPE"]),
            name: getProperty(item, ["name", "NAME"]),
            lastName: getProperty(item, ["lastName", "lastname", "LASTNAME"]),
            nacionality: getProperty(item, ["nacionality", "NACIONALITY"]),
            birthday: getProperty(item, ["birthday", "BIRTHDAY"]),
            phone: getProperty(item, ["phone", "PHONE"]),
            email: getProperty(item, ["email", "EMAIL"]),
            municipality: getProperty(item, ["municipality", "MUNICIPALITY"]),
            state: getProperty(item, ["state", "STATE", "iD_STATE_TRANSACTION", "ID_STATE_TRANSACTION"], 0),
            idtransaction: getProperty(item, ["idtransaction", "iD_TRANSACTION", "ID_TRANSACTION"], 0),
            idClient: getProperty(item, ["idClient", "idclient", "ID_CLIENT"], 0),
            client: getProperty(item, ["client", "CLIENT"]),
            idUserCreated: getProperty(item, ["idUserCreated", "iD_USER_CREATED", "ID_USER_CREATE"], 0),
            userCreated: getProperty(item, ["userCreated", "USER_CREATED"]),
            idUserUpdated: getProperty(item, ["idUserUpdated", "iD_USER_UPDATED", "ID_USER_UPDATED"], 0),
            userUpdated: getProperty(item, ["userUpdated", "USER_UPDATED"]),
            dateCreated: getProperty(item, ["dateCreated", "datE_CREATED", "DATE_CREATED"]),
            product: getProperty(item, ["product", "PRODUCT"]),
            paymenttype: getProperty(item, ["iD_TYPE_PAYMENT", "ID_TYPE_PAYMENT", "paymenttype"]),
            total: getProperty(item, ["totaL_AMOUNT", "TOTAL_AMOUNT", "total"]),
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
    .get("/api/Transaction/" + idTransaction + "/Details", config)
    .then((responseObj) => {
      const { data } = responseObj;
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

export default { getByIdPaypadAndDate, getDetailsByIdTransaction, getExcelReport, downloadVideo, getByIdPaypadAndDateProduct };