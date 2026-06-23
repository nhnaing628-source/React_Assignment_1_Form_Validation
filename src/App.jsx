import React, { useState } from 'react';
import * as Yup from 'yup';
import './App.css';

export default function UserForm() {
  const [formData, setFormData] = useState({
    name: '', age: '', major: '', phNo: '', email: '', university: '', hobby: '', address: ''
  });

  const [errors, setErrors] = useState({});

  const [userList, setUserList] = useState([]);

  const majorOptions = [
    { value: 'B.C.Sc (Computer Science)', label: 'B.C.Sc (Computer Science)' },
    { value: 'B.C.Tech (Computer Technology)', label: 'B.C.Tech (Computer Technology)' },
    { value: 'B.C.Sc (Software Engineering)', label: 'B.C.Sc (Software Engineering)' },
    { value: 'B.C.Sc (Knowledge Engineering)', label: 'B.C.Sc (Knowledge Engineering)' },
    { value: 'B.C.Sc (Business Information Systems)', label: 'B.C.Sc (Business Information Systems)' },
    { value: 'B.C.Tech (Embedded Systems)', label: 'B.C.Tech (Embedded Systems)' },
    { value: 'B.C.Tech (Communication & Networking)', label: 'B.C.Tech (Communication & Networking)' }
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required('အမည် ထည့်သွင်းရန် လိုအပ်ပါသည်'),
    age: Yup.number() 
      .typeError('အသက် ထည့်သွင်းရန် လိုအပ်ပါသည်')
      .positive('အပေါင်းကိန်း ဖြစ်ရပါမည်')
      .integer()
      .required('အသက် ထည့်သွင်းရန် လိုအပ်ပါသည်'),
    major: Yup.string().required('Major ရွေးချယ်ရန် လိုအပ်ပါသည်'),
    phNo: Yup.string()
      .matches(/^[0-9]+$/, "ဖုန်းနံပါတ်သည် ဂဏန်းများသာ ဖြစ်ရပါမည်")
      .required('ဖုန်းနံပါတ် ထည့်သွင်းရန် လိုအပ်ပါသည်'),
    email: Yup.string()
      .email('မှန်ကန်သော Email ပုံစံ ဖြစ်ရပါမည်')
      .required('Email ထည့်သွင်းရန် လိုအပ်ပါသည်'),
    university: Yup.string().required('တက္ကသိုလ်အမည် ထည့်သွင်းရန် လိုအပ်ပါသည်'),
    hobby: Yup.string(), 
    address: Yup.string(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setUserList([...userList, formData]);
      setFormData({
        name: '', age: '', major: '', phNo: '', email: '', university: '', hobby: '', address: ''
      });
      setErrors({});
    } catch (err) {
      const innerErrors = {};
      err.inner.forEach((error) => {
        innerErrors[error.path] = error.message;
      });
      setErrors(innerErrors);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('ဤအချက်အလက်ကို ဖျက်ရန် သေချာပါသလား?')) {
      const filteredList = userList.filter(user => user.id !== id);
      setUserList(filteredList);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Assignment 1: Student Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">1. Name <span className="required-star">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Name" />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">2. Age <span className="required-star">*</span></label>
              <input type="text" name="age" value={formData.age} onChange={handleChange} className="form-input" placeholder="Age" />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">3. Major <span className="required-star">*</span></label>
              <select name="major" value={formData.major} onChange={handleChange} className="form-select">
                <option value="">-- Select Computer Major --</option>
                {majorOptions.map((option, idx) => (
                  <option key={idx} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.major && <span className="error-message">{errors.major}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">4. Ph. No. <span className="required-star">*</span></label>
              <input type="text" name="phNo" value={formData.phNo} onChange={handleChange} className="form-input" placeholder="09xxxxxxxxx" />
              {errors.phNo && <span className="error-message">{errors.phNo}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">5. E-mail <span className="required-star">*</span></label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="example@mail.com" />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">6. University <span className="required-star">*</span></label>
              <input type="text" name="university" value={formData.university} onChange={handleChange} className="form-input" placeholder="UIT / CU" />
              {errors.university && <span className="error-message">{errors.university}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">7. Hobby</label>
              <input type="text" name="hobby" value={formData.hobby} onChange={handleChange} className="form-input" placeholder="Hobby" />
            </div>

            <div className="input-group">
              <label className="input-label">8. Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" placeholder="City" />
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Data</button>
        </form>

        <div className="table-section">
          <h3 className="table-title">Submitted Registered List</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Major</th>
                  <th>Ph. No.</th>
                  <th>E-mail</th>
                  <th>University</th>
                  <th>Hobby</th>
                  <th>Address</th>
                  <th className="th-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {userList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data-text">No data available yet. Submit the form above.</td>
                  </tr>
                ) : (
                  userList.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                      <td>{user.major}</td>
                      <td>{user.phNo}</td>
                      <td>{user.email}</td>
                      <td>{user.university}</td>
                      <td>{user.hobby || '-'}</td>
                      <td>{user.address || '-'}</td>
                      <td className="td-action">
                        <button type="button" onClick={() => handleDelete(user.id)} className="delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}