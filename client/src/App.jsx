import React, { useState, useEffect } from 'react';

// Khai báo đường dẫn API trực tiếp tới Backend trên Render
const API_URL = 'https://mern-backend-236530.onrender.com/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // 1. READ - Lấy danh sách sinh viên
  const fetchStudents = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        }
      })
      .catch((err) => console.error('Lỗi lấy danh sách sinh viên:', err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý thay đổi dữ liệu trong Form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. CREATE & UPDATE - Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // PUT - Cập nhật sinh viên
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(() => {
          setEditingId(null);
          setForm({ studentId: '', name: '', email: '' });
          fetchStudents();
        })
        .catch((err) => console.error('Lỗi cập nhật:', err));
    } else {
      // POST - Thêm mới sinh viên
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(() => {
          setForm({ studentId: '', name: '', email: '' });
          fetchStudents();
        })
        .catch((err) => console.error('Lỗi thêm mới:', err));
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({ studentId: student.studentId, name: student.name, email: student.email });
  };

  // 3. DELETE - Xóa sinh viên
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => fetchStudents())
        .catch((err) => console.error('Lỗi xóa:', err));
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Quản Lý Sinh Viên - MERN Cloud Computing Lab</h2>

      {/* Form nhập thông tin */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          name="studentId"
          placeholder="MSSV"
          value={form.studentId}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>
      </form>

      {/* Bảng hiển thị danh sách sinh viên */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>MSSV</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((st) => (
              <tr key={st._id}>
                <td>{st.studentId}</td>
                <td>{st.name}</td>
                <td>{st.email}</td>
                <td>
                  <button onClick={() => handleEdit(st)}>Sửa</button>
                  <button onClick={() => handleDelete(st._id)} style={{ marginLeft: '8px', color: 'red' }}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có sinh viên nào trong CSDL</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;