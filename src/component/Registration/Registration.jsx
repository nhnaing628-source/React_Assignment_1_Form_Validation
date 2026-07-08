import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const Registration = ({ onLogout }) => {
    const [students, setStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [hobby, setHobby] = useState('');
    const [university, setUniversity] = useState('');
    const [major, setMajor] = useState('');
    const [gender, setGender] = useState('');

    // 🔄 Update Form States (Edit Mode)
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editHobby, setEditHobby] = useState('');
    const [editUniversity, setEditUniversity] = useState('');
    const [editMajor, setEditMajor] = useState('');
    const [editGender, setEditGender] = useState('');

useEffect(() => {
    const q = query(collection(db, "students"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log("Firebase Data Check:", list);
        setStudents(list);
    }, (error) => {
        console.error("Firebase Sync Error:", error);
    });
    return () => unsubscribe();
}, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "students"), {
                name,
                age: Number(age),
                address,
                email,
                phone,
                hobby,
                university,
                major,
                gender,
                createdAt: new Date()
            });

            setName(''); setAge(''); setAddress(''); setEmail(''); setPhone('');
            setHobby(''); setUniversity(''); setMajor(''); setGender('');
            
            setActiveTab('list');
        } catch (error) {
            console.error("Error adding student: ", error);
        }
    };

    const startEdit = (student) => {
        setEditingId(student.id);
        setEditName(student.name || '');
        setEditAge(student.age || '');
        setEditAddress(student.address || '');
        setEditEmail(student.email || '');
        setEditPhone(student.phone || '');
        setEditHobby(student.hobby || '');
        setEditUniversity(student.university || '');
        setEditMajor(student.major || '');
        setEditGender(student.gender || '');

        setActiveTab('register');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const studentRef = doc(db, "students", editingId);
            await updateDoc(studentRef, {
                name: editName,
                age: Number(editAge),
                address: editAddress,
                email: editEmail,
                phone: editPhone,
                hobby: editHobby,
                university: editUniversity,
                major: editMajor,
                gender: editGender
            });

            setEditingId(null);
            setActiveTab('list');
        } catch (error) {
            console.error("Error updating student: ", error);
        }
    };

    const handleDelete = async (id, studentName) => {
        if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
            try {
                await deleteDoc(doc(db, "students", id));
            } catch (error) {
                console.error("Error deleting student: ", error);
            }
        }
    };

    const filteredStudents = students.filter(student => {
        const term = searchTerm.toLowerCase();
        return (
            (student.name && student.name.toLowerCase().includes(term)) ||
            (student.email && student.email.toLowerCase().includes(term)) ||
            (student.phone && student.phone.toLowerCase().includes(term)) ||
            (student.university && student.university.toLowerCase().includes(term)) ||
            (student.major && student.major.toLowerCase().includes(term))
        );
    });

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h3 style={{ color: '#fff', margin: 0 }}>Firebase Workspace</h3>
                    
                    <div style={styles.navGroup}>
                        <button 
                            onClick={() => { setActiveTab('list'); setEditingId(null); }} 
                            style={activeTab === 'list' ? styles.activeNavBtn : styles.navBtn}
                        >
                            📊 Student List ({students.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('register')} 
                            style={activeTab === 'register' ? styles.activeNavBtn : styles.navBtn}
                        >
                            {editingId ? '🔄 Edit Student' : '➕ Add Student'}
                        </button>
                    </div>
                </div>

                <button onClick={onLogout} style={styles.logoutBtn}>Logout Admin 🚪</button>
            </div>

            <div style={styles.contentArea}>

                {/* =================  PAGE 1: REGISTER / EDIT FORM ================= */}
                {activeTab === 'register' && (
                    <div style={styles.singlePageCard}>
                        {editingId ? (
                            <>
                                <h4 style={{ color: '#38bdf8', margin: '0 0 10px 0', fontSize: '18px' }}>🔄 Update Student Profile</h4>
                                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Modify details and save updates to Firebase.</p>
                                
                                <form onSubmit={handleUpdate} style={styles.formGrid}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Full Name</label>
                                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Age (Years)</label>
                                        <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Gender</label>
                                        <select value={editGender} onChange={(e) => setEditGender(e.target.value)} required style={styles.input}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Email Address</label>
                                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Phone Number</label>
                                        <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Address</label>
                                        <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>University</label>
                                        <select value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} required style={styles.input}>
                                            <option value="">Select University</option>
                                            <option value="Yangon University">Yangon University</option>
                                            <option value="Mandalay University">Mandalay University</option>
                                            <option value="UIT">UIT</option>
                                            <option value="YUT">YUT</option>
                                            <option value="Dagon University">Dagon University</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Major</label>
                                        <select value={editMajor} onChange={(e) => setEditMajor(e.target.value)} required style={styles.input}>
                                            <option value="">Select Major</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electronic Engineering">Electronic Engineering</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Business Administration">Business Administration</option>
                                            <option value="English">English</option>
                                        </select>
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>Hobby</label>
                                        <input type="text" value={editHobby} onChange={(e) => setEditHobby(e.target.value)} required style={styles.input} />
                                    </div>

                                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button type="submit" style={{ ...styles.submitBtn, backgroundColor: '#10b981' }}>Save Changes</button>
                                        <button type="button" onClick={() => { setEditingId(null); setActiveTab('list'); }} style={{ ...styles.submitBtn, backgroundColor: '#64748b' }}>Cancel</button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h4 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '18px' }}>➕ Register New Student</h4>
                                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Fill in the details to add a new record into Firebase Database.</p>
                                
                                <form onSubmit={handleRegister} style={styles.formGrid}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Full Name</label>
                                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Age (Years)</label>
                                        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Gender</label>
                                        <select value={gender} onChange={(e) => setGender(e.target.value)} required style={styles.input}>
                                            <option value="">Select Gender...</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Email Address</label>
                                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Phone Number</label>
                                        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Address</label>
                                        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required style={styles.input} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>University</label>
                                        <select value={university} onChange={(e) => setUniversity(e.target.value)} required style={styles.input}>
                                            <option value="">Select University...</option>
                                            <option value="Yangon University">Yangon University</option>
                                            <option value="Mandalay University">Mandalay University</option>
                                            <option value="UIT">UIT</option>
                                            <option value="YUT">YUT</option>
                                            <option value="Dagon University">Dagon University</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Major</label>
                                        <select value={major} onChange={(e) => setMajor(e.target.value)} required style={styles.input}>
                                            <option value="">Select Major...</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electronic Engineering">Electronic Engineering</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Business Administration">Business Administration</option>
                                            <option value="English">English</option>
                                        </select>
                                    </div>
                                    <div style={{ ...styles.inputGroup, gridColumn: 'span 2' }}>
                                        <label style={styles.label}>Hobby</label>
                                        <input type="text" placeholder="Hobby" value={hobby} onChange={(e) => setHobby(e.target.value)} required style={styles.input} />
                                    </div>

                                    <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                        <button type="submit" style={styles.submitBtn}>Register Student</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                )}

                {/* ================= PAGE 2: STUDENT LIST PAGE ================= */}
                {activeTab === 'list' && (
                    <div style={styles.singlePageCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>📊 Verified Student List ({filteredStudents.length})</h4>
                            
                            <input 
                                type="text" 
                                placeholder="🔍 Filter search name, email..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                style={styles.searchBar} 
                            />
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={{ backgroundColor: '#0f172a' }}>
                                        <th style={styles.th}>Name & Bio</th>
                                        <th style={styles.th}>Age & Gender</th>
                                        <th style={styles.th}>Contact Info</th>
                                        <th style={styles.th}>Education & Hobby</th>
                                        <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                                {/* Name */}
                                                <td style={styles.td}>
                                                    <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '15px' }}>{student.name}</div>
                                                </td>
                                                {/* Age & Gender */}
                                                <td style={styles.td}>
                                                    <div style={{ color: '#38bdf8', fontWeight: '500' }}>{student.age ? `${student.age} Yrs` : '-'}</div>
                                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{student.gender}</div>
                                                </td>
                                                {/* Contact */}
                                                <td style={styles.td}>
                                                    <div style={{ color: '#cbd5e1', fontSize: '13px' }}>{student.email}</div>
                                                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>📞 {student.phone}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {student.address}</div>
                                                </td>
                                                {/* Education */}
                                                <td style={styles.td}>
                                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#ffffff' }}>{student.university}</div>
                                                    <div style={{ fontSize: '12px', color: '#10b981' }}>🎓 {student.major}</div>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>⚽ Hobby: {student.hobby}</div>
                                                </td>
                                                {/* Actions */}
                                                <td style={{ ...styles.td, textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button onClick={() => startEdit(student)} style={styles.actionEdit}>✏️ Update</button>
                                                        <button onClick={() => handleDelete(student.id, student.name)} style={styles.actionDelete}>🗑️ Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                                No record found in Firebase.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0b1329', padding: '30px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#141e30', padding: '16px 24px', borderRadius: '8px', border: '1px solid #1e293b' },
    navGroup: { display: 'flex', gap: '10px' },
    navBtn: { padding: '8px 16px', backgroundColor: '#0f172a', color: '#94a3b8', border: '1px solid #1e293b', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    activeNavBtn: { padding: '8px 16px', backgroundColor: '#38bdf8', color: '#0b1329', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' },
    logoutBtn: { padding: '6px 12px', backgroundColor: 'transparent', color: '#f43f5e', border: '1px solid #f43f5e', cursor: 'pointer', borderRadius: '4px', fontSize: '13px' },
    contentArea: { width: '100%', maxWidth: '1100px', margin: '0 auto' },
    singlePageCard: { backgroundColor: '#141e30', padding: '30px', borderRadius: '8px', border: '1px solid #1e293b' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { color: '#94a3b8', fontSize: '12px', fontWeight: '500' },
    input: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', outline: 'none', fontSize: '14px' },
    searchBar: { padding: '10px 16px', width: '250px', borderRadius: '20px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px', outline: 'none' },
    submitBtn: { width: '100%', padding: '12px', backgroundColor: '#38bdf8', color: '#0b1329', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '14px', color: '#94a3b8', fontSize: '12px', textAlign: 'left', fontWeight: '600', textTransform: 'uppercase' },
    td: { padding: '14px', color: '#fff', fontSize: '14px', lineHeight: '1.4' },
    actionEdit: { padding: '6px 12px', backgroundColor: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    actionDelete: { padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default Registration;