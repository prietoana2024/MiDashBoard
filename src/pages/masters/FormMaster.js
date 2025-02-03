import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import mastersService from "../../services/mastersService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import { handleHttpError } from "../../errorHandling/errorHandler";
import { FormText } from "../../components/FormsComponents";

const FormMasters = ({
  masterName,
  masterDto,
  idToEdit,
  createHandler,
  editHandler,
  backHandler,
}) => {
  const isEdit = idToEdit ? true : false;
  const formFieldsAuxInit = [
    { name: "descrip", feedback: null, required: true },
  ];

  const [masterForm, setMasterForm] = useState(masterDto);
  const [formFieldsAux, setFormFieldsAux] = useState([...formFieldsAuxInit]);
  useEffect(() => {
    if (idToEdit !== null) {
      mastersService
        .getById(masterName, idToEdit)
        .then(({ response }) => {
          setMasterForm({
            ...response,
            descrip: response[Object.keys(response)[0]],
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValidForm()) {
      if (isEdit) editHandler(masterForm);
      else createHandler(masterForm);
    }
  };

  const isValidForm = () => {
    let result = true;
    const formFieldsCopy = [...formFieldsAux];
    formFieldsCopy.forEach((field) => {
      const element = document.getElementsByName(field.name)[0];
      //Primero se reinicia el className de cada Elemento
      element.className = "form-control";

      // Validaciones de campos obligatorios
      if ((!element.value || element.value === "") && field.required) {
        element.className += " is-invalid";
        field.feedback = "Campo obligatorio";
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
    });

    setFormFieldsAux([...formFieldsCopy]);
    return result;
  };

  const handleFormChange = ({ target }) => {
    setMasterForm((prevForm) => ({
      ...prevForm,
      [target.name]: target.value,
    }));
  };

  return (
    <>
      <h2 className="mx-3 mt-4 fs-4">{isEdit ? "Editar rol" : "Crear rol"}</h2>
      <button className="btn btn-secondary mx-3 mt-2" onClick={backHandler}>
        <FontAwesomeIcon icon="fa-solid fa-reply" />
        <span className="ms-2">Atrás</span>
      </button>
      <form className="row mx-2 my-4" onSubmit={handleSubmit}>
        <div className="col-3">
          <FormText
            label="Descripción"
            value={masterForm?.descrip}
            fieldName={formFieldsAux[0].name}
            changeFunc={handleFormChange}
            feedback={formFieldsAux[0].feedback}
          />
        </div>
        <div className="row mx-2 my-4">
          <button type="submit" className="btn btn-primary col-2 mx-2 px-1">
            {isEdit ? "Editar Maestro" : "Crear Maestro"}
          </button>
        </div>
      </form>
    </>
  );
};

FormMasters.propTypes = {
  masterName: PropTypes.string.isRequired,
  masterDto: PropTypes.object.isRequired,
  idToEdit: PropTypes.number,
  createHandler: PropTypes.func,
  editHandler: PropTypes.func,
  backHandler: PropTypes.func,
};

export default FormMasters;
