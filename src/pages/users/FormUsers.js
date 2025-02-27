/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FormImg,
  FormPwd,
  FormSelect,
  FormStatus,
  FormText,
} from "../../components/FormsComponents";
import userDto from "../../Dto/usersDto";
import { errorCodes, handleHttpError } from "../../errorHandling/errorHandler";
import clientService from "../../services/clientService";
import mastersService from "../../services/mastersService";
import roleService from "../../services/roleService";
import userService from "../../services/userService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const isEdit = idUserToEdit ? true : false;
  const formFieldsAuxInit = [
    { name: "userName", feedback: null, required: true },
    { name: "typeDocument", feedback: null, required: true },
    { name: "document", feedback: null, required: true },
    { name: "name", feedback: null, required: true },
    { name: "lastName", feedback: null, required: false },
    { name: "phone", feedback: null, required: false },
    { name: "email", feedback: null, required: true },
    { name: "role", feedback: null, required: true },
    { name: "pwd", feedback: null, required: true },
    { name: "pwdConfirm", feedback: null, required: true },
    { name: "img", feedback: null, required: false },
    { name: "client", feedback: null, required: false },
  ];
  let users = [];
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [offices, setOffices] = useState([]);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  const [showOfficeSelection, setShowOfficeSelection] = useState(false);

  useEffect(() => {
    userService
      .getAll()
      .then(({ response }) => {
        users = [...response];
      })
      .catch(async ({ response }) => {
        const [, errMsg] = await handleHttpError(response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      });

    clientService
      .getAll()
      .then(({ response }) => {
        setClients([...response]);
      })
      .catch(async ({ response }) => {
        const [errCode, errMsg] = await handleHttpError(response);
        if (errCode !== errorCodes.notFound) {
          Swal.fire(
            "Ocurrió un error obteniendo los datos del formulario",
            errMsg,
            "error"
          );
          backHandler();
          return;
        }
      });

    roleService
      .getAll()
      .then(({ response }) => {
        setRoles([...response]);
      })
      .catch(async ({ response }) => {
        const [, errMsg] = await handleHttpError(response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      });

    mastersService
      .getAll("TypeDocument")
      .then(({ response }) => {
        setDocumentTypes([...response]);
      })
      .catch(async ({ response }) => {
        const [, errMsg] = await handleHttpError(response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      });

    if (idUserToEdit !== null) {
      userService
        .getById(idUserToEdit)
        .then(({ response }) => {
          setUserForm({ ...response });
          handleRoleChange(response.role, response.client);
        })
        .catch(async ({ response }) => {
          const [, errMsg] = await handleHttpError(response);
          Swal.fire(
            "Ocurrió un error obteniendo los datos del formulario",
            errMsg,
            "error"
          );
          backHandler();
        });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValidUser()) {
      let userToSubmit = { ...userForm };
      if (userForm.role === "Admin") {
        userToSubmit.offices = "ALL";
      } else if (userForm.role === "AdminCustomer" && userForm.selectedOffice) {
        userToSubmit.selectedOffice = userForm.selectedOffice;
      }
      if (isEdit) editHandler(userToSubmit);
      else createHandler(userToSubmit);
    }
  };

  const handleChangePwd = async () => {
    const pwdChanged = await changePwdSweetA().then((result) => {
      if (result.isDenied || result.isDismissed) return false;
      return true;
    });

    if (pwdChanged) {
      Swal.fire({
        text: "Contraseña cambiada con éxito",
        icon: "success",
      });
    }
  };

  const changePwdSweetA = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success me-1",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    });
    return swalWithBootstrapButtons.fire({
      title: "Ingresa la nueva contraseña",
      html:
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Contraseña Actual</label>" +
        "<input id=\"SoldPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Nueva Contraseña</label>" +
        "<input id=\"SnewPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Confirmar Contraseña</label>" +
        "<input id=\"SconfirmPwd\" type=\"password\" class=\"form-control\">" +
        "</div>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const _oldPwd = document.getElementById("SoldPwd").value;
        const _newPwd = document.getElementById("SnewPwd").value;
        const _confirmNewPwd = document.getElementById("SconfirmPwd").value;

        if (_newPwd !== _confirmNewPwd) {
          Swal.showValidationMessage("Las contraseñas deben coincidir");
          return null;
        }
        const regex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(_newPwd)) {
          Swal.showValidationMessage(
            "Las contraseña nueva debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial"
          );
          return null;
        }

        return await userService
          .changePwd({
            document: userForm.document,
            oldPwd: _oldPwd,
            newPwd: _newPwd,
          })
          .catch(async ({ response }) => {
            await handleHttpError(response);
            Swal.showValidationMessage(`${response.data.message}`);
            return null;
          });
      },
      allowOutsideClick: () => false,
    });
  };

  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      // ... other validations ...

      if (field.name === "role" && userForm.role === "AdminCustomer" && !userForm.selectedOffice) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una oficina";
        result = false;
      }
    });

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  const handleFormChange = ({ target }) => {
    if (target.localName == "select") {
      if (target.selectedIndex == 0) return;
      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions["0"].id),
        [target.name]: target.value,
      }));
      if (target.name === "role") {
        handleRoleChange(target.value, userForm.client);
      } else if (target.name === "client" && userForm.role === "AdminCustomer") {
        fetchClientOffices(Number(target.selectedOptions["0"].id));
      }
      return;
    }
    setUserForm((prevForm) => ({
      ...prevForm,
      [target.name]: target.value,
    }));
  };

  const handleRoleChange = (role, clientId) => {
    if (role === "Admin") {
      setShowOfficeSelection(false);
      setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
    } else if (role === "AdminCustomer") {
      setShowOfficeSelection(true);
      if (clientId) {
        fetchClientOffices(clientId);
      }
    } else {
      setShowOfficeSelection(false);
      setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
    }
  };

  const fetchClientOffices = (clientId) => {
    clientService.getByClient(clientId)
      .then((officesData) => {
        setOffices(officesData);
        setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
      })
      .catch(error => console.error("Error fetching client offices:", error));
  };

  const handleChangeInputImage = ({ target }) => {
    if (!target.files || target.files.length <= 0) return;
    const file = target.files[0];
    let fileIsValid = file !== null && file !== undefined;
    fileIsValid = file.type.startsWith("image/");
    if (fileIsValid) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        setUserForm((prevForm) => {
          return {
            ...prevForm,
            imgList: Array.from(byteArray),
            imgExt: file.name.split(".")[1],
          };
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setFormFieldsAux((prevFields) => {
        const element = document.getElementsByName(prevFields[10].name)[0];
        element.className += " is-invalid";
        prevFields[10].feedback = "El archivo debe ser una imagen";
        return [...prevFields];
      });
    }
  };

  return (
    <>
      <h2 className="mx-3 mt-4 fs-4">
        {isEdit ? "Editar Usuario" : "Crear usuario"}
      </h2>
      <button className="btn btn-secondary mx-3 mt-2" onClick={backHandler}>
        <FontAwesomeIcon icon="fa-solid fa-reply" />
        <span className="ms-2">Atrás</span>
      </button>
      <form className="row mx-2 my-4" onSubmit={handleSubmit}>
        <div className="col-3">
          <FormText
            label="Nombre de usuario"
            value={userForm?.userName}
            fieldName={formFieldsAux[0].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[0].feedback}
          />
          <FormSelect
            label="Tipo de Documento"
            fieldName={formFieldsAux[1].name}
            fieldId="idTypeDocument"
            value={userForm?.typeDocument}
            changeFunc={handleFormChange}
            itemList={documentTypes}
            itemKey="typeDocument"
            feedback={formFieldsAux[1].feedback}
          />
          <FormText
            label="Documento"
            value={userForm?.document}
            fieldName={formFieldsAux[2].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[2].feedback}
          />
          <FormText
            label="Nombre"
            value={userForm?.name}
            fieldName={formFieldsAux[3].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[3].feedback}
          />
          <FormText
            label="Apellido/s"
            value={userForm?.lastName}
            fieldName={formFieldsAux[4].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[4].feedback}
          />
        </div>
        <div className="col-1"></div>
        <div className="col-3">
          <FormText
            label="Teléfono"
            value={userForm?.phone}
            fieldName={formFieldsAux[5].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[5].feedback}
          />
          <FormText
            label="Email"
            value={userForm?.email}
            fieldName={formFieldsAux[6].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[6].feedback}
          />
          <FormStatus
            label="Activo"
            value={Boolean(userForm.status)}
            checkFunc={() => {
              setUserForm((prevUserForm) => {
                return { ...prevUserForm, status: Number(!userForm.status) };
              });
            }}
          />
          <FormSelect
            label="Rol"
            fieldName={formFieldsAux[7].name}
            fieldId="idRole"
            value={userForm?.role}
            changeFunc={handleFormChange}
            itemList={roles}
            itemKey="role"
            feedback={formFieldsAux[7].feedback}
          />
          <FormSelect
            label="Cliente Asociado"
            value={userForm.client}
            fieldId="idClient"
            fieldName={formFieldsAux[11].name}
            changeFunc={handleFormChange}
            itemList={clients}
            itemKey="name"
            feedback={formFieldsAux[11].feedback}
            isDisabled={false}
          />
          {showOfficeSelection && (
            <FormSelect
              label="Seleccionar Oficina"
              fieldName="selectedOffice"
              value={userForm.selectedOffice ? userForm.selectedOffice.id : null}
              changeFunc={handleFormChange}
              itemList={offices}
              itemKey="name"
              feedback={formFieldsAux[7].feedback}
            />
          )}
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          ""
        ) : (
          <div className="col-3">
            <FormPwd
              label="Contraseña"
              fieldName={formFieldsAux[8].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[8].feedback}
            />
            <FormPwd
              label="Confirmar Contraseña"
              fieldName={formFieldsAux[9].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[9].feedback}
            />
          </div>
        )}
        <div className="row mx-2 my-4">
          {isEdit ? (
            <button
              type="button"
              className="btn btn-warning col-3 mx-2 px-1"
              onClick={handleChangePwd}
            >
              Cambiar contraseña
            </button>
          ) : (
            ""
          )}
          <button type="submit" className="btn btn-primary col-2 mx-2 px-1">
            {isEdit ? "Editar Usuario" : "Crear usuario"}
          </button>
        </div>
      </form>
    </>
  );
};

FormUsers.propTypes = {
  idUserToEdit: PropTypes.number,
  createHandler: PropTypes.func,
  editHandler: PropTypes.func,
  backHandler: PropTypes.func,
};

export default FormUsers;
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FormImg,
  FormPwd,
  FormSelect,
  FormStatus,
  FormText,
} from "../../components/FormsComponents";
import userDto from "../../Dto/usersDto";
import { errorCodes, handleHttpError } from "../../errorHandling/errorHandler";
import clientService from "../../services/clientService";
import mastersService from "../../services/mastersService";
import roleService from "../../services/roleService";
import userService from "../../services/userService";
import officeService from "../../services/officeService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const isEdit = idUserToEdit ? true : false;
  const formFieldsAuxInit = [
    { name: "userName", feedback: null, required: true },
    { name: "typeDocument", feedback: null, required: true },
    { name: "document", feedback: null, required: true },
    { name: "name", feedback: null, required: true },
    { name: "lastName", feedback: null, required: false },
    { name: "phone", feedback: null, required: false },
    { name: "email", feedback: null, required: true },
    { name: "role", feedback: null, required: true },
    { name: "pwd", feedback: null, required: true },
    { name: "pwdConfirm", feedback: null, required: true },
    { name: "img", feedback: null, required: false },
    { name: "client", feedback: null, required: false },
  ];
  const [users, setUsers] = useState([]); // Moved to state
  const [clientData, setClientData] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedOffices, setSelectedOffices] = useState("");
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [offices, setOffices] = useState([]);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  const [showOfficeSelection, setShowOfficeSelection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, clientResponse, roleResponse, documentTypeResponse] = await Promise.all([
          userService.getAll(),
          clientService.getAll(),
          roleService.getAll(),
          mastersService.getAll("TypeDocument")
        ]);

        setUsers([...userResponse.response]);
        setClients([...clientResponse.response]);
        setRoles([...roleResponse.response]);
        setDocumentTypes([...documentTypeResponse.response]);

        if (idUserToEdit !== null) {
          const user = await userService.getById(idUserToEdit);
          setUserForm({ ...user.response });
          handleRoleChange(user.response.role, user.response.client);
          if (user.response.client) {
            await fetchClientOffices(user.response.client);
          }
        }
      } catch (error) {
        const [, errMsg] = await handleHttpError(error.response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      }
    };

    fetchData();
  }, [idUserToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValidUser()) {
      let userToSubmit = { ...userForm, offices: selectedOffices };
      if (isEdit) editHandler(userToSubmit);
      else createHandler(userToSubmit);
    }
  };

  const handleChangePwd = async () => {
    const pwdChanged = await changePwdSweetA().then((result) => {
      if (result.isDenied || result.isDismissed) return false;
      return true;
    });

    if (pwdChanged) {
      Swal.fire({
        text: "Contraseña cambiada con éxito",
        icon: "success",
      });
    }
  };

  const changePwdSweetA = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success me-1",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    });
    return swalWithBootstrapButtons.fire({
      title: "Ingresa la nueva contraseña",
      html:
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Contraseña Actual</label>" +
        "<input id=\"SoldPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Nueva Contraseña</label>" +
        "<input id=\"SnewPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Confirmar Contraseña</label>" +
        "<input id=\"SconfirmPwd\" type=\"password\" class=\"form-control\">" +
        "</div>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const _oldPwd = document.getElementById("SoldPwd").value;
        const _newPwd = document.getElementById("SnewPwd").value;
        const _confirmNewPwd = document.getElementById("SconfirmPwd").value;

        if (_newPwd !== _confirmNewPwd) {
          Swal.showValidationMessage("Las contraseñas deben coincidir");
          return null;
        }
        const regex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(_newPwd)) {
          Swal.showValidationMessage(
            "Las contraseña nueva debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial"
          );
          return null;
        }

        return await userService
          .changePwd({
            document: userForm.document,
            oldPwd: _oldPwd,
            newPwd: _newPwd,
          })
          .catch(async ({ response }) => {
            await handleHttpError(response);
            Swal.showValidationMessage(`${response.data.message}`);
            return null;
          });
      },
      allowOutsideClick: () => false,
    });
  };

  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      if (field.name === "role" && userForm.role === "AdminCustomer" && !userForm.selectedOffice) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una oficina";
        result = false;
      }
    });

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  const handleFormChange = ({ target }) => {
    if (target.localName == "select") {
      if (target.selectedIndex == 0) return;
      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions["0"].id),
        [target.name]: target.value,
      }));
      if (target.name === "client") {
        const clientId = Number(target.selectedOptions["0"].id);
        handleClientSelection(clientId); // Call here when client selection changes
      }
      return;
    }
    // Other form changes
  };

  const handleShowOffices = async () => {
    // Assuming userForm.client holds the current client ID
    if (userForm.client) {
      await handleClientSelection(userForm.client);
    } else {
      Swal.fire("Por favor, seleccione un cliente primero", "", "info");
    }
  };

  
  const handleRoleChange = (role, clientId) => {
    setShowOfficeSelection(role === "AdminCustomer");
    if (role === "Admin") {
      setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
    } else if (role === "AdminCustomer" && clientId) {
      fetchClientOffices(clientId);
    } else {
      setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
    }
  };
  const handleClientSelection = async (clientId) => {
    try {
      await fetchClientOffices(clientId);
      // Any operations after fetching offices
    } catch (error) {
      console.error("Error in handleClientSelection:", error);
      // Handle the error appropriately
    }
  };
  const fetchClientOffices = async (clientId) => {
    try {
      const result = await officeService.getByClient(clientId);
      // Accedemos a la propiedad response del objeto resultado
      setOffices(result.response || []);
      if (!isEdit) {
        setSelectedOffices("");
      }
      console.log("Oficinas obtenidas:", result.response);
    } catch (error) {
      console.error("Error al obtener oficinas:", error);
      Swal.fire("Error", "No se pudieron cargar las oficinas", "error");
    }
  };
  const handleOfficeSelection = (officeId, isChecked) => {
    const currentOffices = selectedOffices ? selectedOffices.split(',') : [];
    
    if (isChecked) {
      // If checked, add the office ID if it's not already there
     if (!currentOffices.includes(officeId.toString())) {
        setSelectedOffices([...currentOffices, officeId.toString()].join(','));
      }    } else {
      // If unchecked, remove the office ID
      setSelectedOffices(currentOffices.filter(id => id !== officeId.toString()).join(','));
    
    }
    console.log(currentOffices);
  };

  const handleChangeInputImage = ({ target }) => {
    if (!target.files || target.files.length <= 0) return;
    const file = target.files[0];
    let fileIsValid = file !== null && file !== undefined;
    fileIsValid = file.type.startsWith("image/");
    if (fileIsValid) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        setUserForm((prevForm) => {
          return {
            ...prevForm,
            imgList: Array.from(byteArray),
            imgExt: file.name.split(".")[1],
          };
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setFormFieldsAux((prevFields) => {
        const element = document.getElementsByName(prevFields[10].name)[0];
        element.className += " is-invalid";
        prevFields[10].feedback = "El archivo debe ser una imagen";
        return [...prevFields];
      });
    }
  };

  return (
    <>
      <h2 className="mx-3 mt-4 fs-4">
        {isEdit ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <button className="btn btn-secondary mx-3 mt-2" onClick={backHandler}>
        <FontAwesomeIcon icon="fa-solid fa-reply" />
        <span className="ms-2">Atrás</span>
      </button>
      <form className="row mx-2 my-4" onSubmit={handleSubmit}>
        <div className="col-3">
          <FormText
            label="Nombre de usuario"
            value={userForm?.userName}
            fieldName={formFieldsAux[0].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[0].feedback}
          />
          <FormSelect
            label="Tipo de Documento"
            fieldName={formFieldsAux[1].name}
            fieldId="idTypeDocument"
            value={userForm?.typeDocument}
            changeFunc={handleFormChange}
            itemList={documentTypes}
            itemKey="typeDocument"
            feedback={formFieldsAux[1].feedback}
          />
          <FormText
            label="Documento"
            value={userForm?.document}
            fieldName={formFieldsAux[2].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[2].feedback}
          />
          <FormText
            label="Nombre"
            value={userForm?.name}
            fieldName={formFieldsAux[3].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[3].feedback}
          />
          <FormText
            label="Apellido/s"
            value={userForm?.lastName}
            fieldName={formFieldsAux[4].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[4].feedback}
          />
        </div>
        <div className="col-1"></div>
        <div className="col-3">
          <FormText
            label="Teléfono"
            value={userForm?.phone}
            fieldName={formFieldsAux[5].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[5].feedback}
          />
          <FormText
            label="Email"
            value={userForm?.email}
            fieldName={formFieldsAux[6].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[6].feedback}
          />
          <FormStatus
            label="Activo"
            value={Boolean(userForm.status)}
            checkFunc={() => {
              setUserForm((prevUserForm) => {
                return { ...prevUserForm, status: Number(!userForm.status) };
              });
            }}
          />
          <FormSelect
            label="Rol"
            fieldName={formFieldsAux[7].name}
            fieldId="idRole"
            value={userForm?.role}
            changeFunc={handleFormChange}
            itemList={roles}
            itemKey="role"
            feedback={formFieldsAux[7].feedback}
          />
          <FormSelect
            label="Cliente Asociado"
            value={userForm.client}
            fieldId="idClient"
            fieldName="client"
            changeFunc={handleFormChange}
            itemList={clients}
            itemKey="name"
            feedback={formFieldsAux[11].feedback}
            isDisabled={false}
          />
         {offices.length > 0 && (
            <div className="form-group mt-3">
              <label className="form-label">Oficinas Asociadas</label>
              <div className="border rounded p-3">
                {offices.map(office => (
                  <div key={office.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`office-${office.id}`}
                      checked={selectedOffices.split(',').includes(office.id.toString())}
                      onChange={(e) => handleOfficeSelection(office.id, e.target.checked)}
                    />
                    <label 
                      className="form-check-label" 
                      htmlFor={`office-${office.id}`}
                    >
                      {office.name} - {office.address}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          ""
        ) : (
          <div className="col-3">
            <FormPwd
              label="Contraseña"
              fieldName={formFieldsAux[8].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[8].feedback}
            />
            <FormPwd
              label="Confirmar Contraseña"
              fieldName={formFieldsAux[9].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[9].feedback}
            />
          </div>
        )}
        <div className="row mx-2 my-4">
          {isEdit ? (
            <button
              type="button"
              className="btn btn-warning col-3 mx-2 px-1"
              onClick={handleChangePwd}
            >
              Cambiar contraseña
            </button>
          ) : (
            ""
          )}
          <button type="submit" className="btn btn-primary col-2 mx-2 px-1">
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </>
  );
};

FormUsers.propTypes = {
  idUserToEdit: PropTypes.number,
  createHandler: PropTypes.func,
  editHandler: PropTypes.func,
  backHandler: PropTypes.func,
};

export default FormUsers;*/
////////////////////////////
/*import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FormImg,
  FormPwd,
  FormSelect,
  FormStatus,
  FormText,
} from "../../components/FormsComponents";
import userDto from "../../Dto/usersDto";
import { errorCodes, handleHttpError } from "../../errorHandling/errorHandler";
import clientService from "../../services/clientService";
import mastersService from "../../services/mastersService";
import roleService from "../../services/roleService";
import userService from "../../services/userService";
import officeService from "../../services/officeService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const isEdit = idUserToEdit ? true : false;
  const formFieldsAuxInit = [
    { name: "userName", feedback: null, required: true },
    { name: "typeDocument", feedback: null, required: true },
    { name: "document", feedback: null, required: true },
    { name: "name", feedback: null, required: true },
    { name: "lastName", feedback: null, required: false },
    { name: "phone", feedback: null, required: false },
    { name: "email", feedback: null, required: true },
    { name: "role", feedback: null, required: true },
    { name: "pwd", feedback: null, required: true },
    { name: "pwdConfirm", feedback: null, required: true },
    { name: "img", feedback: null, required: false },
    { name: "client", feedback: null, required: false },
  ];
  const [users, setUsers] = useState([]); // Moved to state
  const [clientData, setClientData] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedOffices, setSelectedOffices] = useState("");
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [offices, setOffices] = useState([]);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  const [showOfficeSelection, setShowOfficeSelection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, clientResponse, roleResponse, documentTypeResponse] = await Promise.all([
          userService.getAll(),
          clientService.getAll(),
          roleService.getAll(),
          mastersService.getAll("TypeDocument")
        ]);

        setUsers([...userResponse.response]);
        setClients([...clientResponse.response]);
        setRoles([...roleResponse.response]);
        setDocumentTypes([...documentTypeResponse.response]);

        if (idUserToEdit !== null) {
          const user = await userService.getById(idUserToEdit);
          setUserForm({ ...user.response });
          handleRoleChange(user.response.role, user.response.client);
          if (user.response.client) {
            await fetchClientOffices(user.response.client);
          }
        }
      } catch (error) {
        const [, errMsg] = await handleHttpError(error.response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      }
    };

    fetchData();
  }, [idUserToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValidUser()) {
      let userToSubmit = { ...userForm, offices: selectedOffices };
      if (isEdit) editHandler(userToSubmit);
      else createHandler(userToSubmit);
    }
  };

  const handleChangePwd = async () => {
    const pwdChanged = await changePwdSweetA().then((result) => {
      if (result.isDenied || result.isDismissed) return false;
      return true;
    });

    if (pwdChanged) {
      Swal.fire({
        text: "Contraseña cambiada con éxito",
        icon: "success",
      });
    }
  };

  const changePwdSweetA = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success me-1",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    });
    return swalWithBootstrapButtons.fire({
      title: "Ingresa la nueva contraseña",
      html:
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Contraseña Actual</label>" +
        "<input id=\"SoldPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Nueva Contraseña</label>" +
        "<input id=\"SnewPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Confirmar Contraseña</label>" +
        "<input id=\"SconfirmPwd\" type=\"password\" class=\"form-control\">" +
        "</div>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const _oldPwd = document.getElementById("SoldPwd").value;
        const _newPwd = document.getElementById("SnewPwd").value;
        const _confirmNewPwd = document.getElementById("SconfirmPwd").value;

        if (_newPwd !== _confirmNewPwd) {
          Swal.showValidationMessage("Las contraseñas deben coincidir");
          return null;
        }
        const regex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(_newPwd)) {
          Swal.showValidationMessage(
            "Las contraseña nueva debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial"
          );
          return null;
        }

        return await userService
          .changePwd({
            document: userForm.document,
            oldPwd: _oldPwd,
            newPwd: _newPwd,
          })
          .catch(async ({ response }) => {
            await handleHttpError(response);
            Swal.showValidationMessage(`${response.data.message}`);
            return null;
          });
      },
      allowOutsideClick: () => false,
    });
  };

  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      if (field.name === "role" && userForm.role === "AdminCustomer" && !userForm.selectedOffice) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una oficina";
        result = false;
      }
    });

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  const handleFormChange = ({ target }) => {
    if (target.localName == "select") {
      if (target.selectedIndex == 0) return;
      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions["0"].id),
        [target.name]: target.value,
      }));
      if (target.name === "client") {
        const clientId = Number(target.selectedOptions["0"].id);
        handleClientSelection(clientId); // Call here when client selection changes
      }
      return;
    }
    // Other form changes
  };

  const handleShowOffices = async () => {
    // Assuming userForm.client holds the current client ID
    if (userForm.client) {
      await handleClientSelection(userForm.client);
    } else {
      Swal.fire("Por favor, seleccione un cliente primero", "", "info");
    }
  };

  
  const handleRoleChange = (role, clientId) => {
    setShowOfficeSelection(role === "AdminCustomer");
    if (role === "Admin") {
      setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
    } else if (role === "AdminCustomer" && clientId) {
      fetchClientOffices(clientId);
    } else {
      setUserForm(prevForm => ({ ...prevForm, selectedOffice: null }));
    }
  };
  const handleClientSelection = async (clientId) => {
    try {
      await fetchClientOffices(clientId);
      // Any operations after fetching offices
    } catch (error) {
      console.error("Error in handleClientSelection:", error);
      // Handle the error appropriately
    }
  };
  const fetchClientOffices = async (clientId) => {
    try {
      const result = await officeService.getByClient(clientId);
      // Accedemos a la propiedad response del objeto resultado
      setOffices(result.response || []);
      if (!isEdit) {
        setSelectedOffices("");
      }
      console.log("Oficinas obtenidas:", result.response);
    } catch (error) {
      console.error("Error al obtener oficinas:", error);
      Swal.fire("Error", "No se pudieron cargar las oficinas", "error");
    }
  };

  const handleOfficeSelection = (officeId, isChecked) => {
    const currentOffices = selectedOffices ? selectedOffices.split(',') : [];
    
    if (isChecked) {
      // If checked, add the office ID if it's not already there
     if (!currentOffices.includes(officeId.toString())) {
        setSelectedOffices([...currentOffices, officeId.toString()].join(','));
      }    } else {
      // If unchecked, remove the office ID
      setSelectedOffices(currentOffices.filter(id => id !== officeId.toString()).join(','));
    
    }
    console.log(currentOffices);
  };

  const handleChangeInputImage = ({ target }) => {
    if (!target.files || target.files.length <= 0) return;
    const file = target.files[0];
    let fileIsValid = file !== null && file !== undefined;
    fileIsValid = file.type.startsWith("image/");
    if (fileIsValid) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        setUserForm((prevForm) => {
          return {
            ...prevForm,
            imgList: Array.from(byteArray),
            imgExt: file.name.split(".")[1],
          };
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setFormFieldsAux((prevFields) => {
        const element = document.getElementsByName(prevFields[10].name)[0];
        element.className += " is-invalid";
        prevFields[10].feedback = "El archivo debe ser una imagen";
        return [...prevFields];
      });
    }
  };

  return (
    <>
      <h2 className="mx-3 mt-4 fs-4">
        {isEdit ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <button className="btn btn-secondary mx-3 mt-2" onClick={backHandler}>
        <FontAwesomeIcon icon="fa-solid fa-reply" />
        <span className="ms-2">Atrás</span>
      </button>
      <form className="row mx-2 my-4" onSubmit={handleSubmit}>
        <div className="col-3">
          <FormText
            label="Nombre de usuario"
            value={userForm?.userName}
            fieldName={formFieldsAux[0].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[0].feedback}
          />
          <FormSelect
            label="Tipo de Documento"
            fieldName={formFieldsAux[1].name}
            fieldId="idTypeDocument"
            value={userForm?.typeDocument}
            changeFunc={handleFormChange}
            itemList={documentTypes}
            itemKey="typeDocument"
            feedback={formFieldsAux[1].feedback}
          />
          <FormText
            label="Documento"
            value={userForm?.document}
            fieldName={formFieldsAux[2].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[2].feedback}
          />
          <FormText
            label="Nombre"
            value={userForm?.name}
            fieldName={formFieldsAux[3].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[3].feedback}
          />
          <FormText
            label="Apellido/s"
            value={userForm?.lastName}
            fieldName={formFieldsAux[4].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[4].feedback}
          />
        </div>
        <div className="col-1"></div>
        <div className="col-3">
          <FormText
            label="Teléfono"
            value={userForm?.phone}
            fieldName={formFieldsAux[5].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[5].feedback}
          />
          <FormText
            label="Email"
            value={userForm?.email}
            fieldName={formFieldsAux[6].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[6].feedback}
          />
          <FormStatus
            label="Activo"
            value={Boolean(userForm.status)}
            checkFunc={() => {
              setUserForm((prevUserForm) => {
                return { ...prevUserForm, status: Number(!userForm.status) };
              });
            }}
          />
          <FormSelect
            label="Rol"
            fieldName={formFieldsAux[7].name}
            fieldId="idRole"
            value={userForm?.role}
            changeFunc={handleFormChange}
            itemList={roles}
            itemKey="role"
            feedback={formFieldsAux[7].feedback}
          />
          <FormSelect
            label="Cliente Asociado"
            value={userForm.client}
            fieldId="idClient"
            fieldName="client"
            changeFunc={handleFormChange}
            itemList={clients}
            itemKey="name"
            feedback={formFieldsAux[11].feedback}
            isDisabled={false}
          />
         {offices.length > 0 && (
            <div className="form-group mt-3">
              <label className="form-label">Oficinas Asociadas</label>
              <div className="border rounded p-3">
                {offices.map(office => (
                  <div key={office.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`office-${office.id}`}
                      checked={selectedOffices.split(',').includes(office.id.toString())}
                      onChange={(e) => handleOfficeSelection(office.id, e.target.checked)}
                    />
                    <label 
                      className="form-check-label" 
                      htmlFor={`office-${office.id}`}
                    >
                      {office.name} - {office.address}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          ""
        ) : (
          <div className="col-3">
            <FormPwd
              label="Contraseña"
              fieldName={formFieldsAux[8].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[8].feedback}
            />
            <FormPwd
              label="Confirmar Contraseña"
              fieldName={formFieldsAux[9].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[9].feedback}
            />
          </div>
        )}
        <div className="row mx-2 my-4">
          {isEdit ? (
            <button
              type="button"
              className="btn btn-warning col-3 mx-2 px-1"
              onClick={handleChangePwd}
            >
              Cambiar contraseña
            </button>
          ) : (
            ""
          )}
          <button type="submit" className="btn btn-primary col-2 mx-2 px-1">
            {isEdit ? "Editar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </form>
    </>
  );
};

FormUsers.propTypes = {
  idUserToEdit: PropTypes.number,
  createHandler: PropTypes.func,
  editHandler: PropTypes.func,
  backHandler: PropTypes.func,
};

export default FormUsers;*/
import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import userDto from "../../Dto/usersDto";
import userService from "../../services/userService";
import mastersService from "../../services/mastersService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import roleService from "../../services/roleService";
import { errorCodes, handleHttpError } from "../../errorHandling/errorHandler";
import {
  FormImg,
  FormPwd,
  FormSelect,
  FormStatus,
  FormText,
} from "../../components/FormsComponents";
import clientService from "../../services/clientService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const isEdit = idUserToEdit ? true : false;
  const formFieldsAuxInit = [
    { name: "userName", feedback: null, required: true },
    { name: "typeDocument", feedback: null, required: true },
    { name: "document", feedback: null, required: true },
    { name: "name", feedback: null, required: true },
    { name: "lastName", feedback: null, required: false },
    { name: "phone", feedback: null, required: false },
    { name: "email", feedback: null, required: true },
    { name: "role", feedback: null, required: true },
    { name: "pwd", feedback: null, required: true },
    { name: "pwdConfirm", feedback: null, required: true },
    { name: "img", feedback: null, required: false },
    { name: "client", feedback: null, required: false },
  ];
  let users = [];
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  useEffect(() => {
    userService
      .getAll()
      .then(({ response }) => {
        users = [...response];
      })
      .catch(async ({ response }) => {
        const [, errMsg] = await handleHttpError(response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      });

    clientService
      .getAll()
      .then(({ response }) => {
        setClients([...response]);
      })
      .catch(async ({ response }) => {
        const [errCode, errMsg] = await handleHttpError(response);
        if (errCode !== errorCodes.notFound) {
          Swal.fire(
            "Ocurrió un error obteniendo los datos del formulario",
            errMsg,
            "error"
          );
          backHandler();
          return;
        }
      });

    roleService
      .getAll()
      .then(({ response }) => {
        setRoles([...response]);
      })
      .catch(async ({ response }) => {
        const [, errMsg] = await handleHttpError(response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      });

    mastersService
      .getAll("TypeDocument")
      .then(({ response }) => {
        setDocumentTypes([...response]);
      })
      .catch(async ({ response }) => {
        const [, errMsg] = await handleHttpError(response);
        Swal.fire(
          "Ocurrió un error obteniendo los datos del formulario",
          errMsg,
          "error"
        );
        backHandler();
      });

    if (idUserToEdit !== null) {
      userService
        .getById(idUserToEdit)
        .then(({ response }) => {
          setUserForm({ ...response });
        })
        .catch(async ({ response }) => {
          const [, errMsg] = await handleHttpError(response);
          Swal.fire(
            "Ocurrió un error obteniendo los datos del formulario",
            errMsg,
            "error"
          );
          backHandler();
        });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isValidUser()) {
      if (isEdit) editHandler(userForm);
      else createHandler(userForm);
    }
  };

  const handleChangePwd = async () => {
    const pwdChanged = await changePwdSweetA().then((result) => {
      if (result.isDenied || result.isDismissed) return false;
      return true;
    });

    if (pwdChanged) {
      Swal.fire({
        text: "Contraseña cambiada con éxito",
        icon: "success",
      });
    }
  };

  const changePwdSweetA = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success me-1",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    });
    return swalWithBootstrapButtons.fire({
      title: "Ingresa la nueva contraseña",
      html:
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Contraseña Actual</label>" +
        "<input id=\"SoldPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Nueva Contraseña</label>" +
        "<input id=\"SnewPwd\" type=\"password\" class=\"form-control\">" +
        "</div>" +
        "<div class=\"mb-2\">" +
        "<label class=\"form-label\">Confirmar Contraseña</label>" +
        "<input id=\"SconfirmPwd\" type=\"password\" class=\"form-control\">" +
        "</div>",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const _oldPwd = document.getElementById("SoldPwd").value;
        const _newPwd = document.getElementById("SnewPwd").value;
        const _confirmNewPwd = document.getElementById("SconfirmPwd").value;

        if (_newPwd !== _confirmNewPwd) {
          Swal.showValidationMessage("Las contraseñas deben coincidir");
          return null;
        }
        const regex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(_newPwd)) {
          Swal.showValidationMessage(
            "Las contraseña nueva debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial"
          );
          return null;
        }

        return await userService
          .changePwd({
            document: userForm.document,
            oldPwd: _oldPwd,
            newPwd: _newPwd,
          })
          .catch(async ({ response }) => {
            await handleHttpError(response);
            Swal.showValidationMessage(`${response.data.message}`);
            return null;
          });
      },
      allowOutsideClick: () => false,
    });
  };

  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      //Primero se reinicia el className de cada Elemento
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      // Validaciones de campos obligatorios
      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      // Validacion de caracteres especiales
      if (element.type === "text") {
        const regex = /[!#$%^&*(){}[\]:;<>,?~='\\/]/;
        if (regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "No se permiten carácteres especiales en este campo";
          result = false;
        }
      }

      //Validacion de email
      if (field.name === "email") {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un email valido";
          result = false;
        }
      }

      //Validacion de teléfono
      if (field.name === "phone") {
        const regex = /^[0-9]+$/;
        const regexWithIndicative = /^\+[0-9]+ [0-9]+$/;
        if (
          !regex.test(element.value) &&
          !regexWithIndicative.test(element.value)
        ) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un numero de teléfono valido";
          result = false;
        }
      }

      //Validacion de contraseña
      if (field.name === "pwd" && !isEdit) {
        const elementPwdConfirm = document.getElementsByName("pwdConfirm")[0];
        if (!(element.value === elementPwdConfirm.value)) {
          element.className += " is-invalid";
          field.feedback = "Las contraseñas no coinciden";
          result = false;
        }
        const regex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback =
            "Debe ingresar una contraseña de 8 caracteres, una mayuscula, una minuscula y un caracter especial";
          result = false;
        }
      }

      //Validacion de objetos repetidos
      if (field.name === "userName") {
        if (users.filter((u) => u.userName === element.value).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este nombre";
          result = false;
        }
      }

      if (field.name === "document") {
        if (users.filter((u) => u.document === element.value).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este documento";
          result = false;
        }
      }
    });

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  const handleFormChange = ({ target }) => {
    if (target.localName == "select") {
      if (target.selectedIndex == 0) return;
      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions["0"].id),
        [target.name]: target.value,
      }));
      return;
    }
    setUserForm((prevForm) => ({
      ...prevForm,
      [target.name]: target.value,
    }));
  };

  const handleChangeInputImage = ({ target }) => {
    if (!target.files || target.files.length<=0) return;
    const file = target.files[0];
    let fileIsValid = file !== null && file !== undefined;
    fileIsValid = file.type.startsWith("image/");
    if (fileIsValid) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);
        setUserForm((prevForm) => {
          return {
            ...prevForm,
            imgList: Array.from(byteArray),
            imgExt: file.name.split(".")[1],
          };
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setFormFieldsAux((prevFields) => {
        const element = document.getElementsByName(prevFields[10].name)[0];
        element.className += " is-invalid";
        prevFields[10].feedback = "El archivo debe ser una imagen";
        return [...prevFields];
      });
    }
  };

  return (
    <>
      <h2 className="mx-3 mt-4 fs-4">
        {isEdit ? "Editar Usuario" : "Crear usuario"}
      </h2>
      <button className="btn btn-secondary mx-3 mt-2" onClick={backHandler}>
        <FontAwesomeIcon icon="fa-solid fa-reply" />
        <span className="ms-2">Atrás</span>
      </button>
      <form className="row mx-2 my-4" onSubmit={handleSubmit}>
        <div className="col-3">
          <FormText
            label="Nombre de usuario"
            value={userForm?.userName}
            fieldName={formFieldsAux[0].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[0].feedback}
          />
          <FormSelect
            label="Tipo de Documento"
            fieldName={formFieldsAux[1].name}
            fieldId="idTypeDocument"
            value={userForm?.typeDocument}
            changeFunc={handleFormChange}
            itemList={documentTypes}
            itemKey="typeDocument"
            feedback={formFieldsAux[1].feedback}
          />
          <FormText
            label="Documento"
            value={userForm?.document}
            fieldName={formFieldsAux[2].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[2].feedback}
          />
          <FormText
            label="Nombre"
            value={userForm?.name}
            fieldName={formFieldsAux[3].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[3].feedback}
          />
          <FormText
            label="Apellido/s"
            value={userForm?.lastName}
            fieldName={formFieldsAux[4].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[4].feedback}
          />
        </div>
        <div className="col-1"></div>
        <div className="col-3">
          <FormText
            label="Teléfono"
            value={userForm?.phone}
            fieldName={formFieldsAux[5].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[5].feedback}
          />
          <FormText
            label="Email"
            value={userForm?.email}
            fieldName={formFieldsAux[6].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[6].feedback}
          />
          <FormStatus
            label="Activo"
            value={Boolean(userForm.status)}
            checkFunc={() => {
              setUserForm((prevUserForm) => {
                return { ...prevUserForm, status: Number(!userForm.status) };
              });
            }}
          />
          <FormSelect
            label="Rol"
            fieldName={formFieldsAux[7].name}
            fieldId="idRole"
            value={userForm?.role}
            changeFunc={handleFormChange}
            itemList={roles}
            itemKey="role"
            feedback={formFieldsAux[7].feedback}
          />
          <FormSelect
            label="Cliente Asociado"
            value={ userForm.client}
            fieldId="idClient"
            fieldName={formFieldsAux[11].name}
            changeFunc={handleFormChange}
            itemList={clients}
            itemKey="name"
            feedback={formFieldsAux[11].feedback}
            isDisabled={false}
          />
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          ""
        ) : (
          <div className="col-3">
            <FormPwd
              label="Contraseña"
              fieldName={formFieldsAux[8].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[8].feedback}
            />
            <FormPwd
              label="Confirmar Contraseña"
              fieldName={formFieldsAux[9].name}
              changeFunc={handleFormChange}
              feedback={formFieldsAux[9].feedback}
            />
          </div>
        )}
        <div className="row mx-2 my-4">
          {isEdit ? (
            <button
              type="button"
              className="btn btn-warning col-3 mx-2 px-1"
              onClick={handleChangePwd}
            >
              Cambiar contraseña
            </button>
          ) : (
            ""
          )}
          <button type="submit" className="btn btn-primary col-2 mx-2 px-1">
            {isEdit ? "Editar Usuario" : "Crear usuario"}
          </button>
        </div>
      </form>
    </>
  );
};

FormUsers.propTypes = {
  idUserToEdit: PropTypes.number,
  createHandler: PropTypes.func,
  editHandler: PropTypes.func,
  backHandler: PropTypes.func,
};

export default FormUsers;
