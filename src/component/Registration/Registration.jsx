import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const Registration = ({ onLogout }) => {
    const [students, setStudents] = useState([]);
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editEmail, setEditEmail] = useState('');

    useEffect(() => {
        const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudents(list);
        });
        return () => unsubscribe();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "students"), {
                name,
                phone,
                email,
                createdAt: new Date()
            });
  
            setName('');
            setPhone('');
            setEmail('');
        } catch (error) {
            console.error("Error adding student: ", error);
        }
    };

    const startEdit = (student) => {
        setEditingId(student.id);
        setEditName(student.name);
        setEditPhone(student.phone);
        setEditEmail(student.email);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
   
            const studentDocRef = doc(db, "students", editingId);
            
            await updateDoc(studentDocRef, {
                name: editName,
                phone: editPhone,
                email: editEmail
            });

            setEditingId(null);
        } catch (error) {
            console.error("Error updating student: ", error);
        }
    };

    const handleDelete = async (id, studentName) => {
        if (window.confirm(`Are you sure you want to PERMANENTLY delete ${studentName} from Firebase?`)) {
            try {
                await deleteDoc(doc(db, "students", id));
            } catch (error) {
                console.error("Error deleting student: ", error);
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={{ color: '#fff', margin: 0 }}>Firebase Workspace (Live CRUD Sync)</h3>
                <button onClick={onLogout} style={styles.logoutBtn}>Logout Admin 🚪</button>
            </div>

            <div style={styles.grid}>
                <div style={styles.card}>
                    {editingId ? (
                        <>
                            <h4 style={{ color: '#38bdf8', margin: '0 0 15px 0' }}>🔄 Update Student Record</h4>
                            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '-10px', marginBottom: '20px' }}>This will instantly update the record on Firebase Server.</p>
                            <form onSubmit={handleUpdate} style={styles.form}>
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required style={styles.input} />
                                <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required style={styles.input} />
                                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required style={styles.input} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ ...styles.btn, backgroundColor: '#10b981' }}>Save Update</button>
                                    <button type="button" onClick={() => setEditingId(null)} style={{ ...styles.btn, backgroundColor: '#64748b' }}>Cancel</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h4 style={{ color: '#fff', margin: '0 0 15px 0' }}>➕ Create a user.</h4>
                            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '-10px', marginBottom: '20px' }}>This endpoint lets you create a user.</p>
                            <form onSubmit={handleRegister} style={styles.form}>
                                <input type="text" placeholder="Name string" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
                                <input type="text" placeholder="Phone numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input} />
                                <input type="email" placeholder="Email email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                                <button type="submit" style={styles.btn}>Register</button>
                            </form>
                        </>
                    )}
                </div>

                <div style={styles.card}>
                    <h4 style={{ color: '#fff', margin: '0 0 15px 0' }}>📊 API User List (Token Verified)</h4>
                    <table style={styles.table}>
                        <thead>
                            <tr style={{ backgroundColor: '#0f172a' }}>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Phone</th>
                                <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={styles.td}>{student.name}</td>
                                        <td style={{ ...styles.td, color: '#38bdf8' }}>{student.email}</td>
                                        <td style={styles.td}>{student.phone}</td>
                                        <td style={{ ...styles.td, textAlign: 'center' }}>
                                            {/* ✏️ Update Button */}
                                            <button onClick={() => startEdit(student)} style={styles.actionEdit}>✏️ Update</button>
                                            {/* 🗑️ Delete Button */}
                                            <button onClick={() => handleDelete(student.id, student.name)} style={styles.actionDelete}>🗑️ Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No student data sync from database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0b1329', padding: '30px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    logoutBtn: { padding: '6px 12px', backgroundColor: 'transparent', color: '#f43f5e', border: '1px solid #f43f5e', cursor: 'pointer', borderRadius: '4px', fontSize: '13px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '40px' },
    card: { backgroundColor: '#141e30', padding: '24px', borderRadius: '8px', border: '1px solid #1e293b' },
    form: { display: 'flex', flexDirection: 'column', gap: '14px' },
    input: { padding: '12px 16px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', outline: 'none', fontSize: '14px' },
    btn: { padding: '12px', backgroundColor: '#38bdf8', color: '#0b1329', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', color: '#94a3b8', fontSize: '13px', textAlign: 'left', fontWeight: '600' },
    td: { padding: '12px', color: '#fff', fontSize: '14px' },
    actionEdit: { padding: '5px 10px', marginRight: '6px', backgroundColor: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    actionDelete: { padding: '5px 10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default Registration;