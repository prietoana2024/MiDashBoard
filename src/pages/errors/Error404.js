import React from "react";

const Error404 = () => {
  return (
    <div className="container-fluid pt-2 w-100 h-100 overflow-auto">
      <div className="row m-3 bg-dark rounded-4 p-2">
        <div className="col-12 text-center">
          <img src="/images/404.jpg" style={{ maxWidth: "500px" }} />
          <h1 className="text-danger fw-bold mt-3">Error 404: NotFound</h1>
          <p className="mt-1 fs-3">No se encuentra el recurso solicitado</p>
        </div>
      </div>
    </div>
  );
};

export default Error404;
