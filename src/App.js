/*import "./index.css";
import React, { useState, useEffect } from "react"; // Asegúrate de importar useEffect
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
library.add(fas, far);*/
//SU SESSION A EXPIRADO POR INACTIVIDAD
/*
import "./index.css";
import React, { useState, useEffect, useRef } from "react"; // Asegúrate de importar useEffect
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
  const timeoutId = useRef(null); // Referencia para el temporizador

  // Lógica para el temporizador de inactividad
  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current); // Limpiar el temporizador anterior
    }timeoutId.current = setTimeout(handleTimeout, 2 * 60 * 1000); // 2 minutos de inactividad // timeoutId.current = setTimeout(handleTimeout, 20 * 60 * 1000); // 20 minutos de inactividad
  };

  const handleTimeout = async () => {
    try {
      await userService.logOut();
    } catch (error) {
      console.error("Error durante el logout por inactividad:", error);
    } finally {
      dispatch(setUserLogged(null));
      dispatch(setRoleLogged(null));
      dispatch(setRoutesLogged([]));
      dispatch(setPermitsLogged([]));

      Swal.fire({
        title: "Sesión expirada",
        text: "Su sesión ha expirado por inactividad",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Resetea el temporizador al detectar interacción del usuario
  const events = [
    "mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"
  ];

  useEffect(() => {
    // Solo ejecutar el temporizador si el token existe (usuario autenticado)
    if (token && token !== "") {
      events.forEach(event => {
        const listener = () => resetTimer();
        window.addEventListener(event, listener);
      });

      // Iniciar el temporizador cuando el componente se monte
      resetTimer();

      // Limpiar los event listeners y el temporizador cuando el componente se desmonte
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, () => resetTimer());
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

library.add(fas, far);*/
/*
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
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(window.localStorage.getItem("session"));
  const timeoutId = useRef(null); // Referencia para el temporizador

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
    });

    if (result.isConfirmed) {
      // El usuario quiere extender la sesión, reiniciamos el temporizador
      resetTimer();
    } else {
      // El usuario no quiere extender la sesión, cerramos sesión
      try {
        await logOut(); // Llamar al servicio logOut
      } catch (error) {
        console.error("Error durante el logout por inactividad:", error);
      } finally {
        dispatch(setUserLogged(null));
        dispatch(setRoleLogged(null));
        dispatch(setRoutesLogged([]));
        dispatch(setPermitsLogged([]));
        setToken(null); // Actualizamos el estado del token
        window.localStorage.removeItem("session"); // Eliminamos el token del almacenamiento local

        Swal.fire({
          title: "Sesión expirada",
          text: "Su sesión ha expirado por inactividad",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  // Servicio de logout
  const logOut = () => {
    const token = window.localStorage.getItem("session");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return axios.get("/Auth/Logout", config).then((responseObj) => {
      return responseObj.data;
    });
  };

  // Resetea el temporizador al detectar interacción del usuario
  const events = [
    "mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"
  ];

  useEffect(() => {
    // Solo ejecutar el temporizador si el token existe (usuario autenticado)
    if (token && token !== "") {
      events.forEach(event => {
        const listener = () => resetTimer();
        window.addEventListener(event, listener);
      });

      // Iniciar el temporizador cuando el componente se monte
      resetTimer();

      // Limpiar los event listeners y el temporizador cuando el componente se desmonte
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, () => resetTimer());
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
*//*
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
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState(window.localStorage.getItem("session"));
  const timeoutId = useRef(null); // Referencia para el temporizador principal
  //const modalTimerId = useRef(null); // Referencia para el temporizador del modal

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
    });

    if (result.isConfirmed) {
      // El usuario quiere extender la sesión, reiniciamos el temporizador
      resetTimer();
    } else {
      // El usuario no quiere extender la sesión, cerramos sesión
      try {
        await logOut(); // Llamar al servicio logOut
      } catch (error) {
        console.error("Error durante el logout por inactividad:", error);
      } finally {
        dispatch(setUserLogged(null));
        dispatch(setRoleLogged(null));
        dispatch(setRoutesLogged([]));
        dispatch(setPermitsLogged([]));
        setToken(null); // Actualizamos el estado del token
        window.localStorage.removeItem("session"); // Eliminamos el token del almacenamiento local

        Swal.fire({
          title: "Sesión expirada",
          text: "Su sesión ha expirado por inactividad",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
      }
    }
  };

  // Servicio de logout
  const logOut = () => {
    const token = window.localStorage.getItem("session");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return axios.get("/Auth/Logout", config).then((responseObj) => {
      return responseObj.data;
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
  
  // Servicio de logout
  /*
  const logOut = () => {
    const token = window.localStorage.getItem("session");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    return axios.get("/Auth/Logout", config).then((responseObj) => {
      return responseObj.data;
    });
  };
*/
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
