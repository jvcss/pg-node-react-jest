import React from 'react';

function TableHead({ headers }) {
  return (
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </thead>
  );
}

function TableBody({ rows }) {
  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function Table({ headers, rows }) {
  return (
    <table>
      <TableHead headers={headers} />
      <TableBody rows={rows} />
    </table>
  );
}

export default Table;
