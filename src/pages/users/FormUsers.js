/*import React, { useEffect, useState } from "react";
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
import officeService from "../../services/officeService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [availableOffices, setAvailableOffices] = useState([]);
  const [assignedOffices, setAssignedOffices] = useState([]);
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
    { name: "offices", feedback: null, required: false },
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

          officeService
            .getByUser(idUserToEdit)
            .then(({ response }) => {
              setAssignedOffices(response);
              setSelectedOffices(response.map(office => office.id));

              if (response.length > 0) {
                const clientId = response[0].iD_CLIENT;
                loadClientOffices(clientId);
              }
            })
            .catch(async ({ response }) => {
              const [errCode, errMsg] = await handleHttpError(response);
              if (errCode !== errorCodes.notFound) {
                Swal.fire(
                  "Ocurrió un error obteniendo las oficinas del usuario",
                  errMsg,
                  "error"
                );
              }
            });
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

  // Todas las oficinas siempre habilitadas
  const isOfficeDisabled = (officeId) => {
    console.log(officeId);
    return false;
  };

  const loadClientOffices = (clientId) => {
    if (!clientId) return;

    officeService
      .getByClient(clientId)
      .then(({ response }) => {
        setAvailableOffices(response);
      })
      .catch(async ({ response }) => {
        const [errCode, errMsg] = await handleHttpError(response);
        if (errCode !== errorCodes.notFound) {
          Swal.fire(
            "Ocurrió un error obteniendo las oficinas del cliente",
            errMsg,
            "error"
          );
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
  
    if (isValidUser()) {
      const oficinasString = selectedOffices.join(",");
      userForm.offices = oficinasString;
      console.log(assignedOffices);
      
      if (isEdit) {
        editHandler(userForm);
        console.log(selectedOffices);
      } else {
        createHandler(userForm);
        console.log(selectedOffices);
      }
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
      if (!element) return;

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

      if (element.type === "text") {
        const regex = /[!#$%^&*(){}[\]:;<>,?~='\\/]/;
        if (regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "No se permiten carácteres especiales en este campo";
          result = false;
        }
      }

      if (field.name === "email") {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un email valido";
          result = false;
        }
      }

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

      if (field.name === "userName") {
        if (users.filter((u) => u.userName === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este nombre";
          result = false;
        }
      }

      if (field.name === "document") {
        if (users.filter((u) => u.document === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
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
    if (target.localName === "select") {
      if (target.selectedIndex === 0) return;

      if (target.name === "client") {
        const clientId = Number(target.selectedOptions[0].id);
        loadClientOffices(clientId);
        setSelectedOffices([]);
      }

      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions[0].id),
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

  const handleOfficeSelection = (officeId) => {
    const id = Number(officeId);
    if (selectedOffices.includes(id)) {
      setSelectedOffices(selectedOffices.filter(item => item !== id));
    } else {
      setSelectedOffices([...selectedOffices, id]);
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
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          <div className="col-3">
            <div className="mb-3">
              <label className="form-label">Oficinas Asignadas</label>
              <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {availableOffices.length > 0 ? (
                  availableOffices.map((office) => (
                    <div key={office.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`office-${office.id}`}
                        value={office.id}
                        checked={selectedOffices.includes(office.id)}
                        onChange={() => handleOfficeSelection(office.id)}
                        disabled={isOfficeDisabled(office.id)} // Siempre false
                      />
                      <label className="form-check-label" htmlFor={`office-${office.id}`}>
                        {office.name} - {office.address}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">Seleccione un cliente para ver sus oficinas</p>
                )}
              </div>
            </div>
          </div>
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
            {userForm.client && (
              <div className="mb-3 mt-3">
                <label className="form-label">Oficinas Asignadas</label>
                <div className="border rounded p-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {availableOffices.length > 0 ? (
                    availableOffices.map((office) => (
                      <div key={office.id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`office-${office.id}`}
                          value={office.id}
                          checked={selectedOffices.includes(office.id)}
                          onChange={() => handleOfficeSelection(office.id)}
                          disabled={isOfficeDisabled(office.id)} // Siempre false
                        />
                        <label className="form-check-label" htmlFor={`office-${office.id}`}>
                          {office.name} - {office.address}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">Seleccione un cliente para ver sus oficinas</p>
                  )}
                </div>
              </div>
            )}
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
  isSuperAdmin: PropTypes.bool,
};

export default FormUsers;
*/

/*
import React, { useEffect, useState } from "react";
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
import officeService from "../../services/officeService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
  //isSuperAdmin = false,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [availableOffices, setAvailableOffices] = useState([]);
  const [assignedOffices, setAssignedOffices] = useState([]);
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
    { name: "offices", feedback: null, required: false },
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

          officeService
            .getByUser(idUserToEdit)
            .then(({ response }) => {
              setAssignedOffices(response);

              console.log(
                assignedOffices
              );

              setSelectedOffices(response.map(office => office.id));

              if (response.length > 0) {
                const clientId = response[0].iD_CLIENT;
                loadClientOffices(clientId);
              }
            })
            .catch(async ({ response }) => {
              const [errCode, errMsg] = await handleHttpError(response);
              if (errCode !== errorCodes.notFound) {
                Swal.fire(
                  "Ocurrió un error obteniendo las oficinas del usuario",
                  errMsg,
                  "error"
                );
              }
            });
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

  // Todas las oficinas siempre habilitadas
  const isOfficeDisabled = (officeId) => {
    console.log(officeId);
    return false;
  };

  const loadClientOffices = (clientId) => {
    if (!clientId) return;

    officeService
      .getByClient(clientId)
      .then(({ response }) => {
        setAvailableOffices(response);
      })
      .catch(async ({ response }) => {
        const [errCode, errMsg] = await handleHttpError(response);
        if (errCode !== errorCodes.notFound) {
          Swal.fire(
            "Ocurrió un error obteniendo las oficinas del cliente",
            errMsg,
            "error"
          );
        }
      });
  };

  // Función de validación mejorada
  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];

    // Validar campos del formulario
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      if (!element) return;

      // Resetear clases CSS
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      // Limpiar feedback previo
      field.feedback = null;

      // Validación de campos obligatorios
      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }

      // Validación específica para selects
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      // Validación de caracteres especiales en campos de texto
      if (element.type === "text" && element.value) {
        const regex = /[!#$%^&*(){}[\]:;<>,?~='\\/]/;
        if (regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "No se permiten carácteres especiales en este campo";
          result = false;
        }
      }

      // Validación de email
      if (field.name === "email" && element.value) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un email valido";
          result = false;
        }
      }

      // Validación de teléfono
      if (field.name === "phone" && element.value) {
        const regex = /^[0-9]+$/;
        const regexWithIndicative = /^\+[0-9]+ [0-9]+$/;
        if (!regex.test(element.value) && !regexWithIndicative.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un numero de teléfono valido";
          result = false;
        }
      }

      // Validación de contraseña (solo en creación)
      if (field.name === "pwd" && !isEdit && element.value) {
        const elementPwdConfirm = document.getElementsByName("pwdConfirm")[0];
        if (!(element.value === elementPwdConfirm.value)) {
          element.className += " is-invalid";
          field.feedback = "Las contraseñas no coinciden";
          result = false;
        }
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar una contraseña de 8 caracteres, una mayuscula, una minuscula y un caracter especial";
          result = false;
        }
      }

      // Validación de userName único
      if (field.name === "userName" && element.value) {
        if (users.filter((u) => u.userName === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este nombre";
          result = false;
        }
      }

      // Validación de documento único
      if (field.name === "document" && element.value) {
        if (users.filter((u) => u.document === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este documento";
          result = false;
        }
      }
    });

    // VALIDACIÓN ESPECÍFICA PARA OFICINAS
    const clientFieldIndex = formFieldsCopy.findIndex(field => field.name === "client");
    const officesFieldIndex = formFieldsCopy.findIndex(field => field.name === "offices");

    if (clientFieldIndex !== -1 && officesFieldIndex !== -1) {
      // Verificar si se seleccionó un cliente
      const hasSelectedClient = userForm.client && userForm.client !== "";

      if (hasSelectedClient) {
        // Si hay cliente seleccionado, validar oficinas
        if (!selectedOffices || selectedOffices.length === 0) {
          // Marcar error en la sección de oficinas
          const officesContainer = document.querySelector("#offices-container");
          if (officesContainer) {
            officesContainer.style.border = "2px solid #dc3545";
          }

          formFieldsCopy[officesFieldIndex].feedback = "Debe seleccionar al menos una oficina";
          result = false;

          // Mostrar alerta específica
          Swal.fire({
            title: "Oficinas requeridas",
            text: "Debe seleccionar al menos una oficina para el usuario",
            icon: "warning",
            confirmButtonText: "Entendido"
          });
        } else {
          // Limpiar error si hay oficinas seleccionadas
          const officesContainer = document.querySelector("#offices-container");
          if (officesContainer) {
            officesContainer.style.border = "";
          }
          formFieldsCopy[officesFieldIndex].feedback = null;
        }
      } else {
        // Si no hay cliente, limpiar selección de oficinas y errores
        if (selectedOffices.length > 0) {
          setSelectedOffices([]);
        }
        const officesContainer = document.querySelector("#offices-container");
        if (officesContainer) {
          officesContainer.style.border = "";
        }
        formFieldsCopy[officesFieldIndex].feedback = null;
      }
    }

    // Validaciones adicionales de seguridad

    // Verificar que availableOffices esté cargado si hay cliente
    if (userForm.client && (!availableOffices || availableOffices.length === 0)) {
      Swal.fire({
        title: "Error de carga",
        text: "No se pudieron cargar las oficinas del cliente. Intente nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido"
      });
      result = false;
    }

    // Verificar que las oficinas seleccionadas existan en availableOffices
    if (selectedOffices.length > 0 && availableOffices.length > 0) {
      const availableIds = availableOffices.map(office => office.id);
      const invalidSelections = selectedOffices.filter(id => !availableIds.includes(id));

      if (invalidSelections.length > 0) {
        setSelectedOffices(selectedOffices.filter(id => availableIds.includes(id)));
        Swal.fire({
          title: "Selección actualizada",
          text: "Se eliminaron oficinas que ya no están disponibles",
          icon: "info",
          confirmButtonText: "Entendido"
        });
        result = false;
      }
    }

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  // Función mejorada para manejar envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar formulario
    if (!isValidUser()) {
      // Scroll al primer error
      const firstInvalidElement = document.querySelector(".is-invalid, #offices-container[style*=\"border: 2px solid #dc3545\"]");
      // const firstInvalidElement = document.querySelector('.is-invalid, #offices-container[style*="border: 2px solid #dc3545"]');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      // Preparar datos de oficinas
      const oficinasString = selectedOffices.length > 0 ? selectedOffices.join(",") : "";
      userForm.offices = oficinasString;

      // Ejecutar acción correspondiente
      if (isEdit) {
        editHandler(userForm);
      } else {
        createHandler(userForm);
      }

    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado al procesar el formulario",
        icon: "error",
        confirmButtonText: "Entendido"
      });
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

  // Función mejorada para manejar cambios en el formulario
  const handleFormChange = ({ target }) => {
    if (target.localName === "select") {
      if (target.selectedIndex === 0) return;

      if (target.name === "client") {
        const clientId = Number(target.selectedOptions[0].id);

        // Limpiar oficinas seleccionadas y disponibles
        setSelectedOffices([]);
        setAvailableOffices([]);

        // Limpiar cualquier error de oficinas
        const officesContainer = document.querySelector("#offices-container");
        if (officesContainer) {
          officesContainer.style.border = "";
        }

        // Cargar oficinas del nuevo cliente
        loadClientOffices(clientId);
      }

      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions[0].id),
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

  const handleOfficeSelection = (officeId) => {
    const id = Number(officeId);
    if (selectedOffices.includes(id)) {
      setSelectedOffices(selectedOffices.filter(item => item !== id));
    } else {
      setSelectedOffices([...selectedOffices, id]);
    }
  };

  // Componente para renderizar la sección de oficinas
  const renderOfficesSection = () => (
    <div className="mb-3">
      <label className="form-label">
        Oficinas Asignadas
        {userForm.client && <span className="text-danger"> *</span>}
      </label>
      <div
        className="border rounded p-2"
        style={{ maxHeight: "200px", overflowY: "auto" }}
        id="offices-container"
      >
        {!userForm.client ? (
          <p className="text-muted mb-0">Primero seleccione un cliente</p>
        ) : availableOffices.length === 0 ? (
          <p className="text-muted mb-0">Cargando oficinas...</p>
        ) : (
          availableOffices.map((office) => (
            <div key={office.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`office-${office.id}`}
                value={office.id}
                checked={selectedOffices.includes(office.id)}
                onChange={() => handleOfficeSelection(office.id)}
                disabled={isOfficeDisabled(office.id)}
              />
              <label className="form-check-label" htmlFor={`office-${office.id}`}>
                {office.name} - {office.address}
              </label>
            </div>
          ))
        )}
      </div>
      {selectedOffices.length > 0 && (
        <small className="text-success">
          {selectedOffices.length} oficina{selectedOffices.length !== 1 ? "s" : ""} seleccionada{selectedOffices.length !== 1 ? "s" : ""}
        </small>
      )}
      {formFieldsAux[12]?.feedback && (
        <div className="invalid-feedback d-block">
          {formFieldsAux[12].feedback}
        </div>
      )}
    </div>
  );

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
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          <div className="col-3">
            {renderOfficesSection()}
          </div>
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
            {userForm.client && renderOfficesSection()}
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
  isSuperAdmin: PropTypes.bool,
};

export default FormUsers;


/*

import React, { useEffect, useState } from "react";
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
import officeService from "../../services/officeService";


const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
  //isSuperAdmin = false,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [availableOffices, setAvailableOffices] = useState([]);
  const [assignedOffices, setAssignedOffices] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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
    { name: "offices", feedback: null, required: false },
  ];
  let users = [];
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  // Función para cargar imagen desde localStorage al inicializar el componente
  useEffect(() => {
    const savedImage = localStorage.getItem("userProfileImage");
    console.log("Entro a la funcion  o  a cambiar el valor de la imagen " + savedImage);
    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, []);
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

          officeService
            .getByUser(idUserToEdit)
            .then(({ response }) => {
              setAssignedOffices(response);

              console.log(
                assignedOffices
              );

              setSelectedOffices(response.map(office => office.id));

              if (response.length > 0) {
                const clientId = response[0].iD_CLIENT;
                loadClientOffices(clientId);
              }
            })
            .catch(async ({ response }) => {
              const [errCode, errMsg] = await handleHttpError(response);
              if (errCode !== errorCodes.notFound) {
                Swal.fire(
                  "Ocurrió un error obteniendo las oficinas del usuario",
                  errMsg,
                  "error"
                );
              }
            });
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


  
  // Todas las oficinas siempre habilitadas
  const isOfficeDisabled = (officeId) => {
    console.log(officeId);
    return false;
  };

  const loadClientOffices = (clientId) => {
    if (!clientId) return;

    officeService
      .getByClient(clientId)
      .then(({ response }) => {
        setAvailableOffices(response);
      })
      .catch(async ({ response }) => {
        const [errCode, errMsg] = await handleHttpError(response);
        if (errCode !== errorCodes.notFound) {
          Swal.fire(
            "Ocurrió un error obteniendo las oficinas del cliente",
            errMsg,
            "error"
          );
        }
      });
  };

  // Función de validación mejorada
  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];

    // Validar campos del formulario
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      if (!element) return;

      // Resetear clases CSS
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      // Limpiar feedback previo
      field.feedback = null;

      // Validación de campos obligatorios
      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }

      // Validación específica para selects
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      // Validación de caracteres especiales en campos de texto
      if (element.type === "text" && element.value) {
        const regex = /[!#$%^&*(){}[\]:;<>,?~='\\/]/;
        if (regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "No se permiten carácteres especiales en este campo";
          result = false;
        }
      }

      // Validación de email
      if (field.name === "email" && element.value) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un email valido";
          result = false;
        }
      }

      // Validación de teléfono
      if (field.name === "phone" && element.value) {
        const regex = /^[0-9]+$/;
        const regexWithIndicative = /^\+[0-9]+ [0-9]+$/;
        if (!regex.test(element.value) && !regexWithIndicative.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un numero de teléfono valido";
          result = false;
        }
      }

      // Validación de contraseña (solo en creación)
      if (field.name === "pwd" && !isEdit && element.value) {
        const elementPwdConfirm = document.getElementsByName("pwdConfirm")[0];
        if (!(element.value === elementPwdConfirm.value)) {
          element.className += " is-invalid";
          field.feedback = "Las contraseñas no coinciden";
          result = false;
        }
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar una contraseña de 8 caracteres, una mayuscula, una minuscula y un caracter especial";
          result = false;
        }
      }

      // Validación de userName único
      if (field.name === "userName" && element.value) {
        if (users.filter((u) => u.userName === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este nombre";
          result = false;
        }
      }

      // Validación de documento único
      if (field.name === "document" && element.value) {
        if (users.filter((u) => u.document === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este documento";
          result = false;
        }
      }
    });

    // VALIDACIÓN ESPECÍFICA PARA OFICINAS
    const clientFieldIndex = formFieldsCopy.findIndex(field => field.name === "client");
    const officesFieldIndex = formFieldsCopy.findIndex(field => field.name === "offices");

    if (clientFieldIndex !== -1 && officesFieldIndex !== -1) {
      // Verificar si se seleccionó un cliente
      const hasSelectedClient = userForm.client && userForm.client !== "";

      if (hasSelectedClient) {
        // Si hay cliente seleccionado, validar oficinas
        if (!selectedOffices || selectedOffices.length === 0) {
          // Marcar error en la sección de oficinas
          const officesContainer = document.querySelector("#offices-container");
          if (officesContainer) {
            officesContainer.style.border = "2px solid #dc3545";
          }

          formFieldsCopy[officesFieldIndex].feedback = "Debe seleccionar al menos una oficina";
          result = false;

          // Mostrar alerta específica
          Swal.fire({
            title: "Oficinas requeridas",
            text: "Debe seleccionar al menos una oficina para el usuario",
            icon: "warning",
            confirmButtonText: "Entendido"
          });
        } else {
          // Limpiar error si hay oficinas seleccionadas
          const officesContainer = document.querySelector("#offices-container");
          if (officesContainer) {
            officesContainer.style.border = "";
          }
          formFieldsCopy[officesFieldIndex].feedback = null;
        }
      } else {
        // Si no hay cliente, limpiar selección de oficinas y errores
        if (selectedOffices.length > 0) {
          setSelectedOffices([]);
        }
        const officesContainer = document.querySelector("#offices-container");
        if (officesContainer) {
          officesContainer.style.border = "";
        }
        formFieldsCopy[officesFieldIndex].feedback = null;
      }
    }

    // Validaciones adicionales de seguridad

    // Verificar que availableOffices esté cargado si hay cliente
    if (userForm.client && (!availableOffices || availableOffices.length === 0)) {
      Swal.fire({
        title: "Error de carga",
        text: "No se pudieron cargar las oficinas del cliente. Intente nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido"
      });
      result = false;
    }

    // Verificar que las oficinas seleccionadas existan en availableOffices
    if (selectedOffices.length > 0 && availableOffices.length > 0) {
      const availableIds = availableOffices.map(office => office.id);
      const invalidSelections = selectedOffices.filter(id => !availableIds.includes(id));

      if (invalidSelections.length > 0) {
        setSelectedOffices(selectedOffices.filter(id => availableIds.includes(id)));
        Swal.fire({
          title: "Selección actualizada",
          text: "Se eliminaron oficinas que ya no están disponibles",
          icon: "info",
          confirmButtonText: "Entendido"
        });
        result = false;
      }
    }

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  // Función mejorada para manejar envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar formulario
    if (!isValidUser()) {
      // Scroll al primer error
      const firstInvalidElement = document.querySelector(".is-invalid, #offices-container[style*=\"border: 2px solid #dc3545\"]");
      // const firstInvalidElement = document.querySelector('.is-invalid, #offices-container[style*="border: 2px solid #dc3545"]');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      // Preparar datos de oficinas
      const oficinasString = selectedOffices.length > 0 ? selectedOffices.join(",") : "";
      userForm.offices = oficinasString;

      // Ejecutar acción correspondiente
      if (isEdit) {
        editHandler(userForm);
      } else {
        createHandler(userForm);
      }

    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado al procesar el formulario",
        icon: "error",
        confirmButtonText: "Entendido"
      });
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

  // Función mejorada para manejar cambios en el formulario
  const handleFormChange = ({ target }) => {
    if (target.localName === "select") {
      if (target.selectedIndex === 0) return;

      if (target.name === "client") {
        const clientId = Number(target.selectedOptions[0].id);

        // Limpiar oficinas seleccionadas y disponibles
        setSelectedOffices([]);
        setAvailableOffices([]);

        // Limpiar cualquier error de oficinas
        const officesContainer = document.querySelector("#offices-container");
        if (officesContainer) {
          officesContainer.style.border = "";
        }

        // Cargar oficinas del nuevo cliente
        loadClientOffices(clientId);
      }

      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions[0].id),
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
    if (!target.files || target.files.length <= 0) return;
    console.log(target);
    const file = target.files[0];
    let fileIsValid = file !== null && file !== undefined;
    fileIsValid = fileIsValid && file.type.startsWith("image/");

    if (fileIsValid) {
      const reader = new FileReader();
      console.log(fileIsValid);

      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const byteArray = new Uint8Array(arrayBuffer);

        // Crear URL para el preview
        const imageUrl = URL.createObjectURL(file);
        console.log(imageUrl);

        setImagePreview(imageUrl);
        console.log("Vuelve de actualizar imagen");


        // Guardar en localStorage con clave específica del usuario
        const readerForStorage = new FileReader();
        readerForStorage.onload = (e) => {
          const base64String = e.target.result;
          const storageKey = idUserToEdit ? `userProfileImage_${idUserToEdit}` : "userProfileImage_new";
          localStorage.setItem(storageKey, base64String);
          localStorage.setItem(`${storageKey}_ext`, file.name.split(".")[1]);
        };
        readerForStorage.readAsDataURL(file);

        // Actualizar el formulario
        setUserForm((prevForm) => {
          return {
            ...prevForm,
            imgList: Array.from(byteArray),
            imgExt: file.name.split(".")[1],
          };
        });

        // Limpiar feedback de error si existía
        setFormFieldsAux((prevFields) => {
          const element = document.getElementsByName(prevFields[10].name)[0];
          element.className = element.className.replace(" is-invalid", "");
          prevFields[10].feedback = "";
          return [...prevFields];
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
  const handleOfficeSelection = (officeId) => {
    const id = Number(officeId);
    if (selectedOffices.includes(id)) {
      setSelectedOffices(selectedOffices.filter(item => item !== id));
    } else {
      setSelectedOffices([...selectedOffices, id]);
    }
  };
  // Función para limpiar imagen del localStorage
  const clearImageFromStorage = () => {
    localStorage.removeItem("userProfileImage");
    localStorage.removeItem("userProfileImageExt");
    setImagePreview(null);
  };

  // Componente para renderizar la sección de oficinas
  const renderOfficesSection = () => (
    <div className="mb-3">
      <label className="form-label">
        Oficinas Asignadas
        {userForm.client && <span className="text-danger"> *</span>}
      </label>
      <div
        className="border rounded p-2"
        style={{ maxHeight: "200px", overflowY: "auto" }}
        id="offices-container"
      >
        {!userForm.client ? (
          <p className="text-muted mb-0">Primero seleccione un cliente</p>
        ) : availableOffices.length === 0 ? (
          <p className="text-muted mb-0">Cargando oficinas...</p>
        ) : (
          availableOffices.map((office) => (
            <div key={office.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`office-${office.id}`}
                value={office.id}
                checked={selectedOffices.includes(office.id)}
                onChange={() => handleOfficeSelection(office.id)}
                disabled={isOfficeDisabled(office.id)}
              />
              <label className="form-check-label" htmlFor={`office-${office.id}`}>
                {office.name} - {office.address}
              </label>
            </div>
          ))
        )}
      </div>
      {selectedOffices.length > 0 && (
        <small className="text-success">
          {selectedOffices.length} oficina{selectedOffices.length !== 1 ? "s" : ""} seleccionada{selectedOffices.length !== 1 ? "s" : ""}
        </small>
      )}
      {formFieldsAux[12]?.feedback && (
        <div className="invalid-feedback d-block">
          {formFieldsAux[12].feedback}
        </div>
      )}
    </div>
  );

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
          <div>
            <FormImg
              label="Imagen de perfil"
              fieldName={formFieldsAux[10].name}
              changeFunc={handleChangeInputImage}
              feedback={formFieldsAux[10].feedback}
            />

            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <label>Vista previa:</label>
                <div style={{
                  border: "2px dashed #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  display: "inline-block",
                  marginTop: "5px"
                }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "4px"
                    }}
                  />
                  <div style={{ marginTop: "5px", textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={clearImageFromStorage}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Eliminar imagen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          <div className="col-3">
            {renderOfficesSection()}
          </div>
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
            {userForm.client && renderOfficesSection()}
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
  isSuperAdmin: PropTypes.bool,
};

export default FormUsers;*/

import React, { useEffect, useState } from "react";
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
import officeService from "../../services/officeService";

const FormUsers = ({
  idUserToEdit,
  createHandler,
  editHandler,
  backHandler,
  //isSuperAdmin = false,
}) => {
  const [userForm, setUserForm] = useState(userDto);
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [availableOffices, setAvailableOffices] = useState([]);
  const [assignedOffices, setAssignedOffices] = useState([]);
  
  // CAMBIO: Convertir users a useState
  const [users, setUsers] = useState([]);
  
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
    { name: "offices", feedback: null, required: false },
  ];
  
  const [roles, setRoles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);

  useEffect(() => {
    userService
      .getAll()
      .then(({ response }) => {
        // CAMBIO: Usar setUsers en lugar de asignar directamente
        setUsers([...response]);
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

          officeService
            .getByUser(idUserToEdit)
            .then(({ response }) => {
              setAssignedOffices(response);

              console.log(
                assignedOffices
              );

              setSelectedOffices(response.map(office => office.id));

              if (response.length > 0) {
                const clientId = response[0].iD_CLIENT;
                loadClientOffices(clientId);
              }
            })
            .catch(async ({ response }) => {
              const [errCode, errMsg] = await handleHttpError(response);
              if (errCode !== errorCodes.notFound) {
                Swal.fire(
                  "Ocurrió un error obteniendo las oficinas del usuario",
                  errMsg,
                  "error"
                );
              }
            });
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

  // Todas las oficinas siempre habilitadas
  const isOfficeDisabled = (officeId) => {
    console.log(officeId);
    return false;
  };

  const loadClientOffices = (clientId) => {
    if (!clientId) return;

    officeService
      .getByClient(clientId)
      .then(({ response }) => {
        setAvailableOffices(response);
      })
      .catch(async ({ response }) => {
        const [errCode, errMsg] = await handleHttpError(response);
        if (errCode !== errorCodes.notFound) {
          Swal.fire(
            "Ocurrió un error obteniendo las oficinas del cliente",
            errMsg,
            "error"
          );
        }
      });
  };

  // Función de validación mejorada
  const isValidUser = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];

    // Validar campos del formulario
    formFieldsCopy.forEach((field) => {
      if (isEdit && field.name.includes("pwd")) return;

      const element = document.getElementsByName(field.name)[0];
      if (!element) return;

      // Resetear clases CSS
      if (element.localName === "select") element.className = "form-select";
      else element.className = "form-control";

      // Limpiar feedback previo
      field.feedback = null;

      // Validación de campos obligatorios
      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
        result = false;
      }

      // Validación específica para selects
      if (element.localName === "select" && element.selectedIndex == 0 && field.required) {
        element.className += " is-invalid";
        field.feedback = "Debe seleccionar una opción";
        result = false;
      }

      // Validación de caracteres especiales en campos de texto
      if (element.type === "text" && element.value) {
        const regex = /[!#$%^&*(){}[\]:;<>,?~='\\/]/;
        if (regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "No se permiten carácteres especiales en este campo";
          result = false;
        }
      }

      // Validación de email
      if (field.name === "email" && element.value) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un email valido";
          result = false;
        }
      }

      // Validación de teléfono
      if (field.name === "phone" && element.value) {
        const regex = /^[0-9]+$/;
        const regexWithIndicative = /^\+[0-9]+ [0-9]+$/;
        if (!regex.test(element.value) && !regexWithIndicative.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar un numero de teléfono valido";
          result = false;
        }
      }

      // Validación de contraseña (solo en creación)
      if (field.name === "pwd" && !isEdit && element.value) {
        const elementPwdConfirm = document.getElementsByName("pwdConfirm")[0];
        if (!(element.value === elementPwdConfirm.value)) {
          element.className += " is-invalid";
          field.feedback = "Las contraseñas no coinciden";
          result = false;
        }
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
        if (!regex.test(element.value)) {
          element.className += " is-invalid";
          field.feedback = "Debe ingresar una contraseña de 8 caracteres, una mayuscula, una minuscula y un caracter especial";
          result = false;
        }
      }

      // Validación de userName único
      if (field.name === "userName" && element.value) {
        if (users.filter((u) => u.userName === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este nombre";
          result = false;
        }
      }

      // Validación de documento único
      if (field.name === "document" && element.value) {
        if (users.filter((u) => u.document === element.value && (!isEdit || u.id !== userForm.id)).length > 0) {
          element.className += " is-invalid";
          field.feedback = "Ya existe un usuario con este documento";
          result = false;
        }
      }
    });

    // VALIDACIÓN ESPECÍFICA PARA OFICINAS
    const clientFieldIndex = formFieldsCopy.findIndex(field => field.name === "client");
    const officesFieldIndex = formFieldsCopy.findIndex(field => field.name === "offices");

    if (clientFieldIndex !== -1 && officesFieldIndex !== -1) {
      // Verificar si se seleccionó un cliente
      const hasSelectedClient = userForm.client && userForm.client !== "";

      if (hasSelectedClient) {
        // Si hay cliente seleccionado, validar oficinas
        if (!selectedOffices || selectedOffices.length === 0) {
          // Marcar error en la sección de oficinas
          const officesContainer = document.querySelector("#offices-container");
          if (officesContainer) {
            officesContainer.style.border = "2px solid #dc3545";
          }

          formFieldsCopy[officesFieldIndex].feedback = "Debe seleccionar al menos una oficina";
          result = false;

          // Mostrar alerta específica
          Swal.fire({
            title: "Oficinas requeridas",
            text: "Debe seleccionar al menos una oficina para el usuario",
            icon: "warning",
            confirmButtonText: "Entendido"
          });
        } else {
          // Limpiar error si hay oficinas seleccionadas
          const officesContainer = document.querySelector("#offices-container");
          if (officesContainer) {
            officesContainer.style.border = "";
          }
          formFieldsCopy[officesFieldIndex].feedback = null;
        }
      } else {
        // Si no hay cliente, limpiar selección de oficinas y errores
        if (selectedOffices.length > 0) {
          setSelectedOffices([]);
        }
        const officesContainer = document.querySelector("#offices-container");
        if (officesContainer) {
          officesContainer.style.border = "";
        }
        formFieldsCopy[officesFieldIndex].feedback = null;
      }
    }

    // Validaciones adicionales de seguridad

    // Verificar que availableOffices esté cargado si hay cliente
    if (userForm.client && (!availableOffices || availableOffices.length === 0)) {
      Swal.fire({
        title: "Error de carga",
        text: "No se pudieron cargar las oficinas del cliente. Intente nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido"
      });
      result = false;
    }

    // Verificar que las oficinas seleccionadas existan en availableOffices
    if (selectedOffices.length > 0 && availableOffices.length > 0) {
      const availableIds = availableOffices.map(office => office.id);
      const invalidSelections = selectedOffices.filter(id => !availableIds.includes(id));

      if (invalidSelections.length > 0) {
        setSelectedOffices(selectedOffices.filter(id => availableIds.includes(id)));
        Swal.fire({
          title: "Selección actualizada",
          text: "Se eliminaron oficinas que ya no están disponibles",
          icon: "info",
          confirmButtonText: "Entendido"
        });
        result = false;
      }
    }

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  // Función mejorada para manejar envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar formulario
    if (!isValidUser()) {
      // Scroll al primer error
      const firstInvalidElement = document.querySelector(".is-invalid, #offices-container[style*=\"border: 2px solid #dc3545\"]");
      // const firstInvalidElement = document.querySelector('.is-invalid, #offices-container[style*="border: 2px solid #dc3545"]');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      // Preparar datos de oficinas
      const oficinasString = selectedOffices.length > 0 ? selectedOffices.join(",") : "";
      userForm.offices = oficinasString;

      // Ejecutar acción correspondiente
      if (isEdit) {
        editHandler(userForm);
      } else {
        createHandler(userForm);
      }

    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado al procesar el formulario",
        icon: "error",
        confirmButtonText: "Entendido"
      });
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

  // Función mejorada para manejar cambios en el formulario
  const handleFormChange = ({ target }) => {
    if (target.localName === "select") {
      if (target.selectedIndex === 0) return;

      if (target.name === "client") {
        const clientId = Number(target.selectedOptions[0].id);

        // Limpiar oficinas seleccionadas y disponibles
        setSelectedOffices([]);
        setAvailableOffices([]);

        // Limpiar cualquier error de oficinas
        const officesContainer = document.querySelector("#offices-container");
        if (officesContainer) {
          officesContainer.style.border = "";
        }

        // Cargar oficinas del nuevo cliente
        loadClientOffices(clientId);
      }

      setUserForm((prevForm) => ({
        ...prevForm,
        [target.id]: Number(target.selectedOptions[0].id),
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

  const handleOfficeSelection = (officeId) => {
    const id = Number(officeId);
    if (selectedOffices.includes(id)) {
      setSelectedOffices(selectedOffices.filter(item => item !== id));
    } else {
      setSelectedOffices([...selectedOffices, id]);
    }
  };

  // Componente para renderizar la sección de oficinas
  const renderOfficesSection = () => (
    <div className="mb-3">
      <label className="form-label">
        Oficinas Asignadas
        {userForm.client && <span className="text-danger"> *</span>}
      </label>
      <div
        className="border rounded p-2"
        style={{ maxHeight: "200px", overflowY: "auto" }}
        id="offices-container"
      >
        {!userForm.client ? (
          <p className="text-muted mb-0">Primero seleccione un cliente</p>
        ) : availableOffices.length === 0 ? (
          <p className="text-muted mb-0">Cargando oficinas...</p>
        ) : (
          availableOffices.map((office) => (
            <div key={office.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`office-${office.id}`}
                value={office.id}
                checked={selectedOffices.includes(office.id)}
                onChange={() => handleOfficeSelection(office.id)}
                disabled={isOfficeDisabled(office.id)}
              />
              <label className="form-check-label" htmlFor={`office-${office.id}`}>
                {office.name} - {office.address}
              </label>
            </div>
          ))
        )}
      </div>
      {selectedOffices.length > 0 && (
        <small className="text-success">
          {selectedOffices.length} oficina{selectedOffices.length !== 1 ? "s" : ""} seleccionada{selectedOffices.length !== 1 ? "s" : ""}
        </small>
      )}
      {formFieldsAux[12]?.feedback && (
        <div className="invalid-feedback d-block">
          {formFieldsAux[12].feedback}
        </div>
      )}
    </div>
  );

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
          <FormImg
            label="Imagen de perfil"
            fieldName={formFieldsAux[10].name}
            changeFunc={handleChangeInputImage}
            feedback={formFieldsAux[10].feedback}
          />
        </div>
        <div className="col-1"></div>
        {isEdit ? (
          <div className="col-3">
            {renderOfficesSection()}
          </div>
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
            {userForm.client && renderOfficesSection()}
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
  isSuperAdmin: PropTypes.bool,
};

export default FormUsers;