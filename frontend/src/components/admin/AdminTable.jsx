import { PlusIcon, TrashIcon } from '../ui/Icons.jsx';

/**
 * columns: [{ key, label, render?(row) }]
 * rows: array of data objects (each needs an _id)
 */
export default function AdminTable({ columns, rows, onEdit, onDelete, onCreate, createLabel = 'Add new' }) {
  return (
    <div className="rounded-2xl border border-graphite/10 bg-mist">
      <div className="flex items-center justify-between border-b border-graphite/10 p-4">
        <p className="font-mono text-xs uppercase tracking-wideish text-char/50">{rows.length} items</p>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="flex items-center gap-1.5 rounded-full bg-graphite px-4 py-2 font-mono text-xs text-chalk"
          >
            <PlusIcon size={14} /> {createLabel}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-graphite/10">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wideish text-char/50">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center font-body text-sm text-char/50">
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row._id} className="border-b border-graphite/5 last:border-none">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 font-body text-sm text-char">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      {onEdit && (
                        <button type="button" onClick={() => onEdit(row)} className="font-mono text-xs text-char/60 underline">
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button type="button" onClick={() => onDelete(row)} aria-label="Delete">
                          <TrashIcon size={15} className="text-char/40 hover:text-ember" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
