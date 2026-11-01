import { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon } from '../../components/ui/Icons.jsx';
import AddressForm from '../../components/account/AddressForm.jsx';
import { userService } from '../../services/userService.js';

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => userService.getAddresses().then((data) => setAddresses(data.addresses));

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (data) => {
    await userService.addAddress(data);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    await userService.removeAddress(id);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-char">Saved addresses</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-graphite px-4 py-2 font-mono text-xs text-chalk"
        >
          <PlusIcon size={14} /> Add address
        </button>
      </div>

      {showForm && (
        <div className="mb-8 max-w-md rounded-2xl border border-graphite/10 p-5">
          <AddressForm onSubmit={handleAdd} submitLabel="Save address" />
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="font-body text-sm text-char/50">No saved addresses yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a._id} className="rounded-2xl border border-graphite/10 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm font-medium text-char">{a.fullName}</p>
                  <p className="mt-1 font-body text-sm text-char/60">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postalCode}
                  </p>
                  <p className="mt-1 font-mono text-xs text-char/50">{a.phone}</p>
                </div>
                <button type="button" onClick={() => handleDelete(a._id)} aria-label="Delete address">
                  <TrashIcon size={16} className="text-char/40 hover:text-ember" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
