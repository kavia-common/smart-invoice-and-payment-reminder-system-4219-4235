export default function Table({ columns = [], data = [] }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>{columns.map((c) => <th key={c.key || c.accessor}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ textAlign: 'center' }}>No data</td></tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((c) => (
                  <td key={c.key || c.accessor}>
                    {c.cell ? c.cell(row) : row[c.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
