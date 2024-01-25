import React from 'react';

function InputField({ label, type, id, value, onChange }) {
  return (
    <div>
      <label htmlFor={id}>{label} :</label>
      <input type={type} id={id} value={value} onChange={onChange} />
    </div>
  );
}

export default InputField;
