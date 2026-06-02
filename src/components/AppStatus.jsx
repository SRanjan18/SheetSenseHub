import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '../features/app/appSlice';

export default function AppStatus() {
  const dispatch = useDispatch();
  const { loading, message } = useSelector((state) => state.app);

  if (!loading && !message) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '12px 16px',
        borderRadius: '6px',
        background: '#e5eef9',
        color: '#0b3d73',
      }}
    >
      {loading && <p style={{ margin: 0 }}>Loading...</p>}

      {message && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span>{message}</span>
          <button onClick={() => dispatch(clearMessage())}>Dismiss</button>
        </div>
      )}
    </div>
  );
}