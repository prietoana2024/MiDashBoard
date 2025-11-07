/*import React from "react";
import { MultiSelect } from "primereact/multiselect";

const MultiSelectPayPad = ({ paypads, paypadSelected, handleChangePaypad }) => {
  return (
    <div className="form-group">
      <label htmlFor="paypadSelect" className="form-label">
        PayPad(s)
      </label>
      <MultiSelect
        id="paypadSelect"
        value={paypadSelected}
        options={paypads}
        onChange={handleChangePaypad}
        optionLabel="username"
        placeholder="Seleccione uno o más PayPads"
        className="w-100"
        display="chip"
        filter
        showSelectAll={true}
        selectAllLabel="Seleccionar todos"
        maxSelectedLabels={3}
      />
    </div>
  );
};

export default MultiSelectPayPad;*/
import React from "react";
import PropTypes from "prop-types";
import { MultiSelect } from "primereact/multiselect";

const MultiSelectPayPad = ({ paypads, selectedPaypads, handleChangePaypads }) => {

  console.log("📦 Props recibidas en MultiSelectPayPad:");
  console.log("  - paypads:", paypads);
  console.log("  - selectedPaypads:", selectedPaypads);
  console.log("  - handleChangePaypads:", typeof handleChangePaypads);

  const onChangeHandler = (e) => {
    console.log("🎯 Evento onChange disparado:", e.value);
    handleChangePaypads(e);
  };

  return (
    <div className="form-group">
      <label htmlFor="paypadSelect" className="form-label">
        PayPad(s)
      </label>
      <MultiSelect
        id="paypadSelect"
        value={selectedPaypads}
        options={paypads}
        onChange={onChangeHandler}
        optionLabel="username"
        placeholder="Seleccione uno o más PayPads"
        className="w-100"
        display="chip"
        filter
        showSelectAll={true}
        selectAllLabel="Seleccionar todos"
        maxSelectedLabels={3}
      />
    </div>
  );
};

MultiSelectPayPad.propTypes = {
  paypads: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  selectedPaypads: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  handleChangePaypads: PropTypes.func.isRequired,
};

export default MultiSelectPayPad;