import React from 'react';
import { useTable } from 'react-table';

const PlayerTable = ({ players, setPlayers, showDetails }) => {

  const handleInputChange = (rowId, columnId, value) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === rowId ? { ...player, [columnId]: value } : player
      )
    );
  };

  const renderEditable = (cell) => {
    return (
      <input
        value={cell.value || ''}
        onChange={(e) => handleInputChange(cell.row.original.id, cell.column.id, e.target.value)}
        style={{ width: '100%' }}
      />
    );
  };

  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: renderEditable,
      },
      {
        Header: 'Rating (1-5)',
        accessor: 'rating',
        Cell: renderEditable,
      }
    ];

    return baseColumns;
  }, [showDetails]);

  const data = React.useMemo(() => players, [players]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} className="table table-striped table-bordered">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PlayerTable;
