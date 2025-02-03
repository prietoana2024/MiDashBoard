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

export default FormUsers;*/

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
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import {
  FormImg,
  FormPwd,
  FormSelect,
  FormStatus,
  FormText,
} from "../../components/FormsComponents";
import userDto from "../../Dto/usersDto";
import { handleHttpError } from "../../errorHandling/errorHandler";
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
  const isEdit = Boolean(idUserToEdit);
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

  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [offices, setOffices] = useState([]);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [oficinasSeleccionadasString, setOficinasSeleccionadasString] = useState("");
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  const [showOfficeSelection, setShowOfficeSelection] = useState(false);

  // Update oficinasSeleccionadasString when selectedOffices changes
 
  useEffect(() => {
    const sortedOffices = [...selectedOffices].sort((a, b) => a - b);
    setOficinasSeleccionadasString(sortedOffices.join(","));
  }, [selectedOffices]);

  const fetchClientOffices = async (clientId) => {
    try {
      const result = await officeService.getByClient(clientId);
      const officesList = result.response || [];
      setOffices(officesList);
      
      // Select all offices by default and update the string
      const allOfficeIds = officesList.map(office => office.id);
      setSelectedOffices(allOfficeIds);
      
      // Update oficinasSeleccionadasString directly here
      setOficinasSeleccionadasString(allOfficeIds.sort((a, b) => a - b).join(","));
    } catch (error) {
      console.error("Error al obtener oficinas:", error);
      Swal.fire("Error", "No se pudieron cargar las oficinas", "error");
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

  // Initial data load
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

        if (idUserToEdit) {
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
  }, [idUserToEdit, backHandler]);

  /*const handleSubmit = (event) => {
    event.preventDefault();
    if (isValidUser()) {
      const userToSubmit = { ...userForm, offices: selectedOffices };
      console.log(userToSubmit);
      if (isEdit) {
        editHandler(userToSubmit);
        editOfficeHandler(userToSubmit);
      } else {
        createHandler(userToSubmit);
      }
    }
  };*/

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValidUser()) {
      const userToSubmit = { ...userForm, offices: selectedOffices };
      console.log(userToSubmit);
      if (isEdit) {
        //editHandler(userToSubmit);
        //editOfficeHandler(userToSubmit);
        editHandler(userToSubmit);
        //editOfficeHandler(oficinasSeleccionadasString);
      } else {
        //createHandler(userToSubmit);
        createHandler(userToSubmit);
        //createOfficeHandler(oficinasSeleccionadasString);
      }
    }
  };


  /*const handleSubmit = async (event) => {
    event.preventDefault();
    if (isValidUser()) {
      try {
        if (isEdit) {
          editHandler({ ...userForm, offices: selectedOffices });
        } else {
          const userToSubmit = { ...userForm, offices: selectedOffices };
          await createHandler(userToSubmit, oficinasSeleccionadasString);
          console.log("Oficinas seleccionadas:", oficinasSeleccionadasString, "intento de ingreso a la api");
          //await CreateAndAssigned(userToSubmit, oficinasSeleccionadasString);
          Swal.fire("Éxito", "Usuario creado correctamente", "success");
          backHandler();
        }
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };*/

  //AGREGADO EL 21 DE ENERO
  /*
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isValidUser()) {
      return;
    }
  
    try {
      if (!userForm) {
        throw new Error('El formulario de usuario está vacío');
      }
  
      // Extraemos todas las propiedades excepto 'offices' del userForm
      const { offices: _, ...userFormWithoutOffices } = userForm;
      
      if (isEdit) {
        // Caso de edición
        await editHandler(userFormWithoutOffices, oficinasSeleccionadasString);
        console.log("Editando usuario:", {
          user: userFormWithoutOffices,
          offices: oficinasSeleccionadasString
        });
        await Swal.fire({
          title: "Éxito",
          text: "Usuario actualizado correctamente",
          icon: "success"
        });
      } else {
        // Caso de creación
        await createHandler(userFormWithoutOffices, oficinasSeleccionadasString);
        console.log("Creando usuario:", {
          user: userFormWithoutOffices,
          offices: oficinasSeleccionadasString
        });
        await Swal.fire({
          title: "Éxito",
          text: "Usuario creado correctamente",
          icon: "success"
        });
      }
  
      // Si todo sale bien, volvemos a la página anterior
      backHandler();
  
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    }
  };*/
/*************  ✨ Codeium Command 🌟  *************/
  const handleClientSelection = async (clientId) => {
    try {
      setSelectedOffices([]); // Clear selected offices
      setOficinasSeleccionadasString(""); // Clear the string
      await fetchClientOffices(clientId);
    } catch (error) {
      console.error("Error in handleClientSelection:", error);
    }
  };
/******  968bd837-1b47-4706-b571-06c31ba54d30  *******/

  const handleFormChange = ({ target }) => {
    if (target.localName === "select") {
      if (target.selectedIndex === 0) return;
      
      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions[0].id),
        [target.name]: target.value,
      }));

      if (target.name === "client") {
        const clientId = Number(target.selectedOptions[0].id);
        handleClientSelection(clientId);
      }

      if (target.name === "role") {
        handleRoleChange(target.value, userForm.client);
      }
      return;
    }

    setUserForm((prevForm) => ({
      ...prevForm,
      [target.name]: target.value,
    }));
  };

  const handleOfficeSelection = (officeId, isChecked) => {
    setSelectedOffices(prevOffices => {
      const newSelection = isChecked 
        ? [...prevOffices, officeId] 
        : prevOffices.filter(id => id !== officeId);
      return newSelection;
    });
  };

  const clearSelectedOffices = () => {
    setSelectedOffices([]);
    setOficinasSeleccionadasString("");
  };

  const handleChangeInputImage = ({ target }) => {
    // Implementation for image handling
  };

  const isValidUser = () => {
    // Implementation for user validation
    return true;
  };

  const handleChangePwd = async () => {
    // Implementation for password change
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
        <div className="col-5">
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
          {!isEdit && (
            <div>
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
          {isEdit && (
            <button
              type="button"
              className="btn btn-warning col-3 mx-2 px-1"
              onClick={handleChangePwd}
            >
              Cambiar contraseña
            </button>
          )}
        </div>
        <div className="col-1"></div>
        <div className="col-5">
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
              setUserForm((prevUserForm) => ({
                ...prevUserForm,
                status: Number(!userForm.status)
              }));
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
              <div className="mb-3" style={{
                borderRadius: "5px",
                backgroundColor: "#ffffff",
                padding: "6px 12px",
                fontSize: "1rem",
                fontWeight: "400"
              }}>
                {selectedOffices.map(officeId => {
                  const office = offices.find(o => o.id === officeId);
                  return (
                    <div key={office.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{
                        color: "#212529",
                      }}>{office.name}</span>
                      <button
                        style={{
                          borderRadius: "35px",
                        }}
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleOfficeSelection(office.id, false)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-check" />
                      </button>
                    </div>
                  );
                })}

                <div style={{
                  width: "100%",
                  marginBottom: "0",
                  fontWeight: 600,
                  fontSize: "1rem"
                }}>
                  {offices.filter(office => !selectedOffices.includes(office.id)).length > 0 ? (
                    offices
                      .filter(office => !selectedOffices.includes(office.id))
                      .map(office => (
                        <div key={office.id} className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{
                            color: "#212529",
                          }}>{office.name}</span>
                          <button
                            style={{
                              borderRadius: "35px",
                            }}
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleOfficeSelection(office.id, true)}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-plus" />
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="text-muted" style={{
                      color: "#212529",
                      fontSize: "0.5rem",
                      fontWeight: "400",
                      padding: "0px",
                      color: "#ffffff",
                    }}>No hay oficinas disponibles</div>
                  )}
                </div>
              </div>
              <small style={{ color: "#212529"}} className="text-muted mt-2 d-block">
                Oficinas seleccionadas: {oficinasSeleccionadasString || "Ninguna"}
              </small>
              {/*<small className="text-muted mt-2 d-block">
                Oficinas seleccionadas: {oficinasSeleccionadasString || "Ninguna"}
              </small>*/}
              <div className="mt-2">
                <FontAwesomeIcon
                  icon="fa-solid fa-rotate-left"
                  onClick={clearSelectedOffices}
                  style={{ cursor: "pointer" }}
                />
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
        <div className="col-12 mt-3">
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

export default FormUsers;