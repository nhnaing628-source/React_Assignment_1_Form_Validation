import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (err) {
            setError('Invalid Admin Credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.loginCard}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>Firebase Admin</h2>
                    <p style={{ color: '#8f9cae', fontSize: '13px', marginTop: '6px' }}>Secure Assignment Workspace Login</p>
                </div>

                {error && <div style={styles.alertError}>{error}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Admin Email</label>
                        <input type="email" placeholder="admin@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                    </div>
                    <button type="submit" disabled={loading} style={styles.loginBtn}>
                        {loading ? 'Verifying Admin...' : 'Login Credentials'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    loginContainer: { minHeight: '100vh', backgroundColor: '#0b1329', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', boxSizing: 'border-box' },
    loginCard: { backgroundColor: '#141e30', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '360px', border: '1px solid #1e293b' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { color: '#ffffff', fontSize: '14px', fontWeight: '500' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', fontSize: '14px', outline: 'none' },
    loginBtn: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#38bdf8', color: '#0b1329', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
    alertError: { padding: '12px 16px', borderRadius: '6px', fontSize: '14px', marginBottom: '20px', textAlign: 'center', fontWeight: '500', backgroundColor: '#4c1d95', color: '#f43f5e', border: '1px solid #f43f5e' }
};

export default Login;