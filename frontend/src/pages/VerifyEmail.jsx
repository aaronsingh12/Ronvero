import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckIcon, CloseIcon } from '../components/ui/Icons.jsx';
import api from '../services/axiosInstance.js';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-5 py-28 text-center">
      {status === 'verifying' && <p className="font-body text-char/60">Verifying your email…</p>}
      {status === 'success' && (
        <>
          <CheckIcon size={28} className="text-ember" />
          <h1 className="font-display text-2xl font-semibold text-char">Email verified</h1>
          <Link to="/account" className="btn-primary">
            Go to my account
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <CloseIcon size={28} className="text-ember" />
          <h1 className="font-display text-2xl font-semibold text-char">Link expired</h1>
          <p className="font-body text-char/60">Please request a new verification email from your account.</p>
        </>
      )}
    </div>
  );
}
