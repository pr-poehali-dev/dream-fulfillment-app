import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import func2url from '../../backend/func2url.json';

export default function VKCallback() {
  const navigate = useNavigate();
  const { login } = useUser();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error || !code) {
      navigate('/', { replace: true });
      return;
    }

    const redirect_uri = `${window.location.origin}/vk-callback`;

    fetch(func2url['vk-auth'], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          login(data);
        }
        navigate('/', { replace: true });
      })
      .catch(() => navigate('/', { replace: true }));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#060810',
      color: '#c9a84c',
      fontFamily: 'Golos Text, sans-serif',
      fontSize: 18,
    }}>
      Входим через ВКонтакте...
    </div>
  );
}
