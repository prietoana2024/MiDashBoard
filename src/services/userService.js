import axios from "axios";
import { pki, util } from "node-forge";

const GENERAL_HEADERS = {
  // eslint-disable-next-line no-undef
  DashboardKeyId: process.env.REACT_APP_DKEYID,
};

const encryptPwd = (pwd) => {
  // NOTA: Remember to save any public key to environment without headers/footers and each line separated by _
  // eslint-disable-next-line no-undef
  const publicKeyArray = process.env.REACT_APP_PUBKEY.split("_");
  let publicKeyPem = "-----BEGIN PUBLIC KEY-----\n";
  publicKeyArray.forEach((line) => {
    publicKeyPem += line + "\n";
  });
  publicKeyPem += "-----END PUBLIC KEY-----";

  const publicKey = pki.publicKeyFromPem(publicKeyPem);

  // Encriptar los datos
  const encryptedData = publicKey.encrypt(pwd, "RSA-OAEP");
  return util.encode64(encryptedData);
};

const login = (credentials) => {
  const config = {
    headers: { ...GENERAL_HEADERS },
  };

  credentials.password = encryptPwd(credentials.password);
  return axios.post("/Auth/Login", credentials, config).then((responseObj) => {
    return responseObj.data;
  });
};

const verifyPwd = (credentials) => {
  const config = {
    headers: { ...GENERAL_HEADERS },
  };

  credentials.password = encryptPwd(credentials.password);
  return axios.post("/Auth/VerifyPwd", credentials, config).then((responseObj) => {
    return responseObj.data;
  });
};

const logOut = () => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.get("/Auth/Logout", config).then((responseObj) => {
    return responseObj.data;
  });
};


const getAll = () => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.get("/api/User", config).then((responseObj) => {
    return responseObj.data;
  });
};

const getLogged = () => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.get("/api/User/Logged", config).then((responseObj) => {
    return responseObj.data;
  });
};


const getByRole = (role) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.get(`/api/User/Role/${role}`, config).then((responseObj) => {
    return responseObj.data;
  });
};

const getById = (id) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.get(`/api/User/${id}`, config).then((responseObj) => {
    return responseObj.data;
  });
};

const update = (user) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.put("/api/User", user, config).then((responseObj) => {
    return responseObj.data;
  });
};

  
const create = async (user) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  user.pwd = encryptPwd(user.pwd);
  console.log("user",user);
  try {
    const responseObj = await axios.post("/api/User", user, config);
    //const userId = responseObj.data.response.id;

    //await assignOffices(userId, oficinasSeleccionadasString);
    
    return responseObj;

  } catch (error) {
    console.error("Error in user creation or office assignment:", error);
    throw error;
  }
};

const assignOffices = (userId, offices) => {
  console.log("userId", userId,"offices", offices);
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };

  const request = {
    ID: userId,
    Offices: offices
  };

  return axios.post("/api/User/AssignedOfficeForIDUserAsync", request, config)
    .then((response) => response.data);
};
//FUNCIONAL CREATE USUARIO SOLO
/*const create = (user) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  user.pwd = encryptPwd(user.pwd);
  return axios.post("/api/User", user, config).then((responseObj) => {
    return responseObj.data;
  });
  
};*/
//ULTIMO AGREGADO 21-01





/*const create = (userToSubmit, oficinasSeleccionadasString) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` }
  };

  // Create the user object with all required fields
  // The user object is in the same format as the userDto
  const user = {
    id: userToSubmit.id,
    pwd: encryptPwd(userToSubmit.pwd),
    document: userToSubmit.document,
    idTypeDocument: userToSubmit.idTypeDocument,
    typeDocument: userToSubmit.typeDocument,
    userName: userToSubmit.userName,
    name: userToSubmit.name,
    lastName: userToSubmit.lastName,
    phone: userToSubmit.phone,
    email: userToSubmit.email,
    idRole: userToSubmit.idRole,
    role: userToSubmit.role,
    status: userToSubmit.status,
    idClient: userToSubmit.idClient,
    client: userToSubmit.client,
    img: userToSubmit.img,
    imgExt: userToSubmit.imgExt,
    imgList: userToSubmit.imgList,
    idUserCreated: 1,
    userCreated: "root",
    idUserUpdated: 1,
    userUpdated: "root"
  };

  // Create the payload in the expected format
  // The payload is an object with two properties:
  // 1. newUser: The user object with all required fields
  // 2. offices: The string of offices selected by the user
  const payload = {
    newUser: user,
    offices: oficinasSeleccionadasString
  };

  console.log("Datos a enviar:", payload);

  // Send the formatted payload in the request body instead of query params
  // The request is sent with the POST method and the payload is sent in the request body
  // The response is expected to be in the same format as the userDto
  return axios.post(
    `/api/User/CreateAndAssignedOfficeAsync`,
    payload,
    config
  ).then((responseObj) => {
    return responseObj.data;
  }).catch((error) => {
    if (error.response) {
      // If the error is a response from the server, get the message from the response data
      throw new Error(error.response.data.message || 'Error en la creación del usuario');
    } else if (error.request) {
      // If the error is a request error, throw a generic error message
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al realizar la petición');
    }
  });
};*/
//TERMINA ULTIMO 21-01
/*const create = (userToSubmit, oficinasSeleccionadasString) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` }
  };

  // Creamos un nuevo objeto con las propiedades que necesitamos
  const user = {
    id: userToSubmit.id,
    pwd: encryptPwd(userToSubmit.pwd),
    document: userToSubmit.document,
    idTypeDocument: userToSubmit.idTypeDocument,
    typeDocument: userToSubmit.typeDocument,
    userName: userToSubmit.userName,
    name: userToSubmit.name,
    lastName: userToSubmit.lastName,
    phone: userToSubmit.phone,
    email: userToSubmit.email,
    idRole: userToSubmit.idRole,
    role: userToSubmit.role,
    status: userToSubmit.status,
    idClient: userToSubmit.idClient,
    client: userToSubmit.client,
    img: userToSubmit.img,
    imgExt: userToSubmit.imgExt,
    imgList: userToSubmit.imgList,
    idUserCreated:1,
    userCreated:"root",
    idUserUpdated:1,
    userUpdated:"root",
    selectedOffice: oficinasSeleccionadasString
  };
 
  console.log("Datos a enviar:", { user, offices: oficinasSeleccionadasString });
  
  // Enviamos los parámetros como query string para 'offices'
  return axios.post(
    `/api/User/CreateAndAssignedOfficeAsync?offices=${oficinasSeleccionadasString}`,
    user,
    config
  ).then((responseObj) => {
    return responseObj.data;
  }).catch((error) => {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en la creación del usuario');
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al realizar la petición');
    }
  });
};*/

/*
const create = (userToSubmit, oficinasSeleccionadasString) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` }
  };

  // Creamos una copia del objeto omitiendo 'offices'
  const newUser = Object.assign({}, userToSubmit);
  delete newUser.offices;
  newUser.pwd = encryptPwd(userToSubmit.pwd);

  delete newUser.selectedOffice;
  newUser.userCreated=1;
  newUser.userUpdated=1;
  offices="";
  const requestData = {
    newUser,
    offices:oficinasSeleccionadasString
  };
 
  console.log("requestData para creación:", requestData);
  
  return axios.post(
    "/api/User/CreateAndAssignedOfficeAsync",
    requestData,
    config
  ).then((responseObj) => {
    return responseObj.data;
  }).catch((error) => {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en la creación del usuario');
    } else if (error.request) {
      throw new Error('No se recibió respuesta del servidor');
    } else {
      throw new Error('Error al realizar la petición');
    }
  });
};*/


const edit = (userToSubmit, oficinasSeleccionadasString) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` }
  };

  // Si hay contraseña, la encriptamos
  if (userToSubmit.pwd) {
    userToSubmit.pwd = encryptPwd(userToSubmit.pwd);
  }

  const updateUser = { ...userToSubmit };
  
  // Aseguramos que no se incluya la propiedad offices
  delete updateUser.offices;

  const requestData = {
    updateUser,
    offices: oficinasSeleccionadasString
  };
 
  console.log("requestData para actualización:", requestData);
  
  return axios.put(
    "/api/User/UpdateAndAssignedOfficeAsync",
    requestData,
    config
  ).then((responseObj) => {
    return responseObj.data;
  }).catch((error) => {
    if (error.response) {
      throw new Error(error.response.data.message || "Error en la actualización del usuario");
    } else if (error.request) {
      throw new Error("No se recibió respuesta del servidor");
    } else {
      throw new Error("Error al realizar la petición");
    }
  });
};
///TERMINA MI ADICION
const deleteU = (id) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  return axios.delete(`/api/User/${id}`, config).then((responseObj) => {
    return responseObj.data;
  });
};

const changePwd = (changePwdData) => {
  const token = window.localStorage.getItem("session");
  const config = {
    headers: { ...GENERAL_HEADERS, Authorization: `Bearer ${token}` },
  };
  changePwdData.oldPwd = encryptPwd(changePwdData.oldPwd);
  changePwdData.newPwd = encryptPwd(changePwdData.newPwd);
  return axios.put("/api/User/ChangePwd", changePwdData, config).then((responseObj) => {
    return responseObj.data;
  });
};

export default {
  login,
  verifyPwd,
  logOut,
  getAll,
  getLogged,
  getByRole,
  getById,
  update,
  create,
  deleteU,
  changePwd,
  edit,
  assignOffices
};
