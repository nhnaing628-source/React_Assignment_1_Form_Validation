import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Folder Structure အတိုင်း ပတ်လမ်းကြောင်း
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const Registration = ({ onLogout }) => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search Filter အတွက် State

    // ➕ Add Form States (အချက်အလက် ၈ ခု)
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [hobby, setHobby] = useState('');
    const [university, setUniversity] = useState('');
    const [major, setMajor] = useState('');
    const [gender, setGender] = useState('');

    // 🔄 Update Form States (Edit Mode အတွက်)
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editHobby, setEditHobby] = useState('');
    const [editUniversity, setEditUniversity] = useState('');
    const [editMajor, setEditMajor] = useState('');
    const [editGender, setEditGender] = useState('');

    // 📡 ၁။ Real-time Listener: Firebase နှင့် အမြဲတမ်း ချိတ်ဆက်ထားခြင်း
    useEffect(() => {
        const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(list);
        });
        return () => unsubscribe();
    }, []);

    // ➕ ၂။ Add Function: ကျောင်းသားအသစ်ကို Firebase Firestore သို့ သိမ်းဆည်းခြင်း
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "students"), {
                name, address, email, phone, hobby, university, major, gender,
                createdAt: new Date()
            });
            // Form Variables ကို Reset ပြန်ချခြင်း
            setName(''); setAddress(''); setEmail(''); setPhone('');
            setHobby(''); setUniversity(''); setMajor(''); setGender('');
        } catch (error) { console.error(error); }
    };

    // ✏️ ၃။ Edit Mode ဖွင့်ခြင်း (ဒေတာများကို Form ထဲသို့ ကူးထည့်ခြင်း)
    const startEdit = (student) => {
        setEditingId(student.id);
        setEditName(student.name);
        setEditAddress(student.address || '');
        setEditEmail(student.email);
        setEditPhone(student.phone);
        setEditHobby(student.hobby || '');
        setEditUniversity(student.university || '');
        setEditMajor(student.major || '');
        setEditGender(student.gender || '');
    };

    // 🔄 ၄။ Update Function: ပြင်ဆင်ချက်များကို Firebase တွင် သွားရောက်ပြောင်းလဲခြင်း
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const studentDocRef = doc(db, "students", editingId);
            await updateDoc(studentDocRef, {
                name: editName,
                address: editAddress,
                email: editEmail,
                phone: editPhone,
                hobby: editHobby,
                university: editUniversity,
                major: editMajor,
                gender: editGender
            });
            setEditingId(null); // Edit Mode ပိတ်မည်
        } catch (error) { console.error(error); }
    };

    // 🗑️ ၅။ Delete Function: Firebase ထဲမှ အပြီးပိုင် ဖျက်ချခြင်း
    const handleDelete = async (id, studentName) => {
        if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
            try { await deleteDoc(doc(db, "students", id)); } catch (error) { console.error(error); }
        }
    };

    // 🔍 ၆။ Search Filter Logic: ရိုက်လိုက်တဲ့စာလုံးပေါ်မူတည်ပြီး List ကို ချက်ချင်းစစ်ထုတ်ပေးခြင်း
    const filteredStudents = students.filter(student => {
        const term = searchTerm.toLowerCase();
        return (
            student.name?.toLowerCase().includes(term) ||
            student.email?.toLowerCase().includes(term) ||
            student.phone?.toLowerCase().includes(term) ||
            student.university?.toLowerCase().includes(term)
        );
    });

    return (
        <div style={styles.container}>
            {/* Topbar */}
            <div style={styles.header}>
                <h3 style={{ color: '#fff', margin: 0 }}>Student Management Workspace (Live CRUD)</h3>
                <button onClick={onLogout} style={styles.logoutBtn}>Logout Admin 🚪</button>
            </div>

            <div style={styles.grid}>
                {/* 👈 ဘယ်ဘက်ခြမ်း: Dynamic Input Form */}
                <div style={styles.card}>
                    {editingId ? (
                        <>
                            <h4 style={{ color: '#38bdf8', margin: '0 0 15px 0' }}>🔄 Update Student Profile</h4>
                            <form onSubmit={handleUpdate} style={styles.form}>
                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" required style={styles.input} />
                                <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Address" required style={styles.input} />
                                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" required style={styles.input} />
                                <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone" required style={styles.input} />
                                <input type="text" value={editHobby} onChange={(e) => setEditHobby(e.target.value)} placeholder="Hobby" required style={styles.input} />
                                
                                {/* University Dropdown */}
                                <select value={editUniversity} onChange={(e) => setEditUniversity(e.target.value)} required style={styles.input}>
                                    <option value="">Select University</option>
                                    <option value="Yangon University">Yangon University</option>
                                    <option value="Mandalay University">Mandalay University</option>
                                    <option value="UIT">UIT</option>
                                    <option value="YUT">YUT</option>
                                </select>

                                {/* Major Dropdown */}
                                <select value={editMajor} onChange={(e) => setEditMajor(e.target.value)} required style={styles.input}>
                                    <option value="">Select Major</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Electronic Engineering">Electronic Engineering</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Business Administration">Business Administration</option>
                                </select>

                                {/* Gender Dropdown */}
                                <select value={editGender} onChange={(e) => setEditGender(e.target.value)} required style={styles.input}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ ...styles.btn, backgroundColor: '#10b981' }}>Save Changes</button>
                                    <button type="button" onClick={() => setEditingId(null)} style={{ ...styles.btn, backgroundColor: '#64748b' }}>Cancel</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h4 style={{ color: '#fff', margin: '0 0 15px 0' }}>➕ Create Student Profile</h4>
                            <form onSubmit={handleRegister} style={styles.form}>
                                <input type="text" placeholder="Name string" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
                                <input type="text" placeholder="Address string" value={address} onChange={(e) => setAddress(e.target.value)} required style={styles.input} />
                                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                                <input type="text" placeholder="Phone numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required style={styles.input} />
                                <input type="text" placeholder="Hobby string" value={hobby} onChange={(e) => setHobby(e.target.value)} required style={styles.input} />
                                
                                {/* University Dropdown Option */}
                                <select value={university} onChange={(e) => setUniversity(e.target.value)} required style={styles.input}>
                                    <option value="">Choose University...</option>
                                    <option value="Yangon University">Yangon University</option>
                                    <option value="Mandalay University">Mandalay University</option>
                                    <option value="UIT">UIT</option>
                                    <option value="YUT">YUT</option>
                                </select>

                                {/* Major Dropdown Option */}
                                <select value={major} onChange={(e) => setMajor(e.target.value)} required style={styles.input}>
                                    <option value="">Choose Major...</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Electronic Engineering">Electronic Engineering</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Business Administration">Business Administration</option>
                                </select>

                                {/* Gender Dropdown Option */}
                                <select value={gender} onChange={(e) => setGender(e.target.value)} required style={styles.input}>
                                    <option value="">Choose Gender...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>

                                <button type="submit" style={styles.btn}>Register Student</button>
                            </form>
                        </>
                    )}
                </div>

                {/* 👉 ညာဘက်ခြမ်း: Search Bar နှင့် Student Database Table List */}
                <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ color: '#fff', margin: 0 }}>📊 Verified Records ({filteredStudents.length})</h4>
                        
                        {/* 🔍 REAL-TIME SEARCH BAR INPUT */}
                        <input 
                            type="text" 
                            placeholder="🔍 Search name, email, phone..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            style={styles.searchBar} 
                        />
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ backgroundColor: '#0f172a' }}>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Contact & Bio</th>
                                    <th style={styles.th}>Edu Academic</th>
                                    <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} style={{ borderBottom: '1px solid #1e293b' }}>
                                            {/* Name & Gender */}
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '600' }}>{student.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{student.gender}</div>
                                            </td>
                                            {/* Contact details */}
                                            <td style={styles.td}>
                                                <div style={{ color: '#38bdf8', fontSize: '13px' }}>{student.email}</div>
                                                <div style={{ fontSize: '13px' }}>📞 {student.phone}</div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>📍 {student.address}</div>
                                            </td>
                                            {/* Education & Hobby */}
                                            <td style={styles.td}>
                                                <div style={{ fontSize: '13px', fontWeight: '500' }}>{student.university}</div>
                                                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>🎓 {student.major}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b', italic: 'true' }}>🏀 Hobby: {student.hobby}</div>
                                            </td>
                                            {/* CRUD Buttons */}
                                            <td style={{ ...styles.td, textAlign: 'center', verticalAlign: 'middle' }}>
                                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                    <button onClick={() => startEdit(student)} style={styles.actionEdit}>✏️ Update</button>
                                                    <button onClick={() => handleDelete(student.id, student.name)} style={styles.actionDelete}>🗑️ Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                            No matched student found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CSS STYLING ---
const styles = {
    container: { minHeight: '100vh', backgroundColor: '#0b1329', padding: '30px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    logoutBtn: { padding: '6px 12px', backgroundColor: 'transparent', color: '#f43f5e', border: '1px solid #f43f5e', cursor: 'pointer', borderRadius: '4px', fontSize: '13px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '30px' },
    card: { backgroundColor: '#141e30', padding: '24px', borderRadius: '8px', border: '1px solid #1e293b' },
    form: { display: 'flex', flexDirection: 'column', gap: '12px' },
    input: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', outline: 'none', fontSize: '14px' },
    searchBar: { padding: '8px 14px', width: '220px', borderRadius: '20px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff', fontSize: '13px', outline: 'none' },
    btn: { padding: '12px', backgroundColor: '#38bdf8', color: '#0b1329', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px', color: '#94a3b8', fontSize: '12px', textAlign: 'left', fontWeight: '600', textTransform: 'uppercase' },
    td: { padding: '12px', color: '#fff', fontSize: '14px', lineHeight: '1.5' },
    actionEdit: { padding: '4px 8px', backgroundColor: 'transparent', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
    actionDelete: { padding: '4px 8px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }
};

export default Registration;