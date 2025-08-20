/*import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import LoginForm from "./pages/login/LoginForm";
import Main from "./Main";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import userService from "./services/userService";
import Swal from "sweetalert2";
import { handleHttpError } from "./errorHandling/errorHandler";
import { useDispatch } from "react-redux";
import roleService from "./services/roleService";
import { setPermitsLogged, setRoleLogged, setRoutesLogged, setUserLogged } from "./app/loginSlice";
import { PrimeReactProvider } from "primereact/api";
import { addLocale } from "primereact/api";

const App = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(window.localStorage.getItem("session"));
  const timeoutId = useRef(null); // Referencia para el temporizador principal

  // Lógica para el temporizador de inactividad
  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current); // Limpiar el temporizador anterior
    }
    timeoutId.current = setTimeout(handleTimeout, 2 * 60 * 1000); // 2 minutos de inactividad (para pruebas)
  };


  // Manejar el tiempo de inactividad
  const handleTimeout = async () => {
    const result = await Swal.fire({
      title: "¿Desea extender su sesión?",
      text: "Su sesión está a punto de expirar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Extender sesión",
      cancelButtonText: "Cerrar sesión",
      allowOutsideClick: false, // Evita cerrar el modal haciendo clic fuera
      allowEscapeKey: false,    // Opcional: evita cerrar con la tecla Escape
      allowEnterKey: true,      // Permite confirmar con Enter
      didOpen: () => {
        // Aquí puedes capturar el clic en el botón de "Cerrar sesión"
        const closeSessionButton = document.querySelector(".swal2-cancel"); // El botón "Cerrar sesión"

        // Agregar el evento click al botón de "Cerrar sesión"
        closeSessionButton.addEventListener("click", async () => {
          try {
            console.log("CERRAR SESION"); // Aquí puedes manejar la lógica de cerrar sesión
            logOut(); // Llamamos a la función de logout sin pasar el evento

            // Limpiamos el estado de la sesión
            dispatch(setUserLogged(null));
            dispatch(setRoleLogged(null));
            dispatch(setRoutesLogged([]));
            dispatch(setPermitsLogged([]));
            setToken(null); // Actualizamos el estado del token
            window.localStorage.removeItem("session"); // Eliminamos el token del almacenamiento local

            Swal.fire({
              title: "Sesión cerrada",
              text: "Has cerrado sesión exitosamente",
              icon: "success",
              confirmButtonText: "Aceptar",
            });
          } catch (error) {
            console.error("Error durante el logout:", error);
          }
        });
      },
    });

    if (result.isConfirmed) {
      // El usuario quiere extender la sesión, reiniciamos el temporizador
      resetTimer();
    } else {
      // Si el resultado es cancelar o cerramos la sesión
      logOut(); // Llamamos a logOut directamente sin pasar el evento
      dispatch(setUserLogged(null));
      dispatch(setRoleLogged(null));
      dispatch(setRoutesLogged([]));
      dispatch(setPermitsLogged([]));
      setToken(null); // Actualizamos el estado del token
      window.localStorage.removeItem("session"); // Eliminamos el token del almacenamiento local

      try {
        console.log("Cancelar o cerrar sesión"); // Llamar al servicio logOut
      } catch (error) {
        console.error("Error durante el logout por inactividad:", error);
      } finally {
        Swal.fire({
          title: "Sesión expirada",
          text: "Su sesión ha expirado por inactividad",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  const logOut = () => {
    userService
      .logOut()
      .then(() => {
        window.localStorage.removeItem("session");
        window.location.href = "/"; // Redirigir al inicio o página de login
      })
      .catch(({ response }) => {
        // Si hay un error, lo logueamos
        if (process.env.NODE_ENV === "development") {
          console.log(response);
        }
      });
  };

  // Resetea el temporizador al detectar interacción del usuario
  const events = [
    "mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"
  ];

  useEffect(() => {
    // Solo ejecutar el temporizador si el token existe (usuario autenticado)
    if (token && token !== "") {
      const resetTimerWrapper = () => resetTimer(); // Definir el listener
      events.forEach(event => {
        window.addEventListener(event, resetTimerWrapper);
      });

      // Iniciar el temporizador cuando el componente se monte
      resetTimer();

      // Limpiar los event listeners y el temporizador cuando el componente se desmonte
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetTimerWrapper);
        });
        if (timeoutId.current) {
          clearTimeout(timeoutId.current); // Limpiar el temporizador cuando el componente se desmonte
        }
      };
    }
  }, [token]); // Este useEffect se ejecuta cuando el token cambia

  useEffect(() => {
    addLocale("es", {
      firstDayOfWeek: 1,
      showMonthAfterYear: true,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: "Hoy",
      clear: "Limpiar"
    });
  }, []); // Este useEffect se ejecuta solo una vez al montar el componente

  const saveSessionToken = (newToken) => {
    setToken(newToken);
    window.localStorage.setItem("session", newToken);
  };

  const setLoginData = async () => {
    let roleId = 0;
    if (token !== null && token !== "" && token !== undefined) {
      await userService
        .getLogged()
        .then(({ response }) => {
          dispatch(setUserLogged(response));
          roleId = response.idRole;
        })
        .catch(async ({ response }) => {
          await handleHttpError(response);
          Swal.fire({
            text: "Ocurrió un error obteniendo la información del usuario",
            icon: "error",
          });
        });

      await roleService
        .getById(roleId)
        .then(({ response }) => {
          dispatch(setRoleLogged(response));
          dispatch(setRoutesLogged(response.routes));
          dispatch(setPermitsLogged(response.permissions));
        })
        .catch(async ({ response }) => {
          await handleHttpError(response);
          Swal.fire({
            text: "Ocurrió un error obteniendo la información del usuario",
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    setLoginData();
  }, [token]); // Este useEffect se ejecutará cada vez que token cambie

  return (
    <PrimeReactProvider>
      <div className="App">
        {token !== null && token !== "" && token !== undefined ? (
          <Main />
        ) : (
          <LoginForm handlerToken={saveSessionToken} />
        )}
      </div>
    </PrimeReactProvider>
  );
};

export default App;

library.add(fas, far);
*/
import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import LoginForm from "./pages/login/LoginForm";
import Main from "./Main";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import userService from "./services/userService";
import Swal from "sweetalert2";
import { handleHttpError } from "./errorHandling/errorHandler";
import { useDispatch } from "react-redux";
import roleService from "./services/roleService";
import { setPermitsLogged, setRoleLogged, setRoutesLogged, setUserLogged } from "./app/loginSlice";
import { PrimeReactProvider } from "primereact/api";
import { addLocale } from "primereact/api";

const App = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(window.localStorage.getItem("session"));
  const timeoutId = useRef(null); // Referencia para el temporizador principal
  const modalTimeoutId = useRef(null); // Referencia para el temporizador del modal

  // Lógica para el temporizador de inactividad
  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current); // Limpiar el temporizador anterior
    }
    timeoutId.current = setTimeout(handleTimeout, 15 * 60 * 1000); // 15 minutos de inactividad
  };

  // Función para cerrar sesión y limpiar estados
  const closeSession = async () => {
    try {
      await logOut();
      // Limpiamos el estado de la sesión
      dispatch(setUserLogged(null));
      dispatch(setRoleLogged(null));
      dispatch(setRoutesLogged([]));
      dispatch(setPermitsLogged([]));
      setToken(null);
      window.localStorage.removeItem("session");
    } catch (error) {
      console.error("Error durante el logout:", error);
    }
  };

  // Manejar el tiempo de inactividad
  const handleTimeout = async () => {
    let timerInterval;
    let timeLeft = 120; // 2 minutos en segundos

    const result = await Swal.fire({
      title: "¿Desea extender su sesión?",
      html: `Su sesión está a punto de expirar.<br><br>
             <strong>Tiempo restante: <span id="timer">${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}</span></strong>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Extender sesión",
      cancelButtonText: "Cerrar sesión",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: true,
      timer: 120000, // 2 minutos en milisegundos
      timerProgressBar: true,
      didOpen: () => {
        // Iniciar el contador regresivo
        timerInterval = setInterval(() => {
          timeLeft--;
          const minutes = Math.floor(timeLeft / 60);
          const seconds = timeLeft % 60;
          const timerElement = document.getElementById("timer");
          
          if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
          }
          
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
          }
        }, 1000);

        // Manejar el clic en el botón de "Cerrar sesión"
        const closeSessionButton = document.querySelector(".swal2-cancel");
        closeSessionButton.addEventListener("click", async () => {
          clearInterval(timerInterval);
          await closeSession();
          
          Swal.fire({
            title: "Sesión cerrada",
            text: "Has cerrado sesión exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
        });
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });

    if (result.isConfirmed) {
      // El usuario quiere extender la sesión, reiniciamos el temporizador
      clearInterval(timerInterval);
      resetTimer();
      
      Swal.fire({
        title: "Sesión extendida",
        text: "Su sesión ha sido extendida exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 2000,
        timerProgressBar: true
      });
    } else if (result.dismiss === Swal.DismissReason.timer) {
      // El modal se cerró por timeout automático (2 minutos sin respuesta)
      clearInterval(timerInterval);
      await closeSession();
      
      Swal.fire({
        title: "Sesión expirada",
        text: "Su sesión ha expirado por inactividad. No se recibió respuesta a tiempo.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    } else {
      // Si el resultado es cancelar manualmente
      clearInterval(timerInterval);
      await closeSession();
      
      Swal.fire({
        title: "Sesión cerrada",
        text: "Su sesión ha sido cerrada",
        icon: "info",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const logOut = () => {
    return userService
      .logOut()
      .then(() => {
        window.localStorage.removeItem("session");
        window.location.href = "/"; // Redirigir al inicio o página de login
      })
      .catch(({ response }) => {
        // Si hay un error, lo logueamos
        if (process.env.NODE_ENV === "development") {
          console.log(response);
        }
        throw response; // Re-lanzar el error para manejarlo en closeSession
      });
  };

  // Resetea el temporizador al detectar interacción del usuario
  const events = [
    "mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"
  ];

  useEffect(() => {
    // Solo ejecutar el temporizador si el token existe (usuario autenticado)
    if (token && token !== "") {
      const resetTimerWrapper = () => resetTimer();
      events.forEach(event => {
        window.addEventListener(event, resetTimerWrapper);
      });

      // Iniciar el temporizador cuando el componente se monte
      resetTimer();

      // Limpiar los event listeners y el temporizador cuando el componente se desmonte
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, resetTimerWrapper);
        });
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        if (modalTimeoutId.current) {
          clearTimeout(modalTimeoutId.current);
        }
      };
    }
  }, [token]);

  useEffect(() => {
    addLocale("es", {
      firstDayOfWeek: 1,
      showMonthAfterYear: true,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: "Hoy",
      clear: "Limpiar"
    });
  }, []);

  const saveSessionToken = (newToken) => {
    setToken(newToken);
    window.localStorage.setItem("session", newToken);
  };

  const setLoginData = async () => {
    let roleId = 0;
    if (token !== null && token !== "" && token !== undefined) {
      await userService
        .getLogged()
        .then(({ response }) => {
          dispatch(setUserLogged(response));
          roleId = response.idRole;
        })
        .catch(async ({ response }) => {
          await handleHttpError(response);
          Swal.fire({
            text: "Ocurrió un error obteniendo la información del usuario",
            icon: "error",
          });
        });

      await roleService
        .getById(roleId)
        .then(({ response }) => {
          dispatch(setRoleLogged(response));
          dispatch(setRoutesLogged(response.routes));
          dispatch(setPermitsLogged(response.permissions));
        })
        .catch(async ({ response }) => {
          await handleHttpError(response);
          Swal.fire({
            text: "Ocurrió un error obteniendo la información del usuario",
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    setLoginData();
  }, [token]);

  return (
    <PrimeReactProvider>
      <div className="App">
        {token !== null && token !== "" && token !== undefined ? (
          <Main />
        ) : (
          <LoginForm handlerToken={saveSessionToken} />
        )}
      </div>
    </PrimeReactProvider>
  );
};

export default App;

library.add(fas, far);