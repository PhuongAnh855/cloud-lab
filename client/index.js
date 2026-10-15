const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

const BACKEND_URL = process.env.BACKEND_URL || 'https://mern-backend-lephuonganh.onrender.com';

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quản Lý Sinh Viên - MERN Stack</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f9f9f9; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        form { display: flex; gap: 10px; margin-bottom: 25px; }
        input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        button:hover { background-color: #0056b3; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Quản Lý Sinh Viên (Cloud Production)</h1>
        
        <form id="studentForm">
          <input type="text" id="studentId" placeholder="MSSV" required />
          <input type="text" id="name" placeholder="Họ và Tên" required />
          <input type="email" id="email" placeholder="Email" required />
          <button type="submit">Thêm Sinh Viên</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ và Tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody id="studentList">
            <tr><td colspan="3" style="text-align:center;">Đang tải dữ liệu...</td></tr>
          </tbody>
        </table>
      </div>

      <script>
        const API_URL = "${BACKEND_URL}";

        async function loadStudents() {
          try {
            const res = await fetch(\`\${API_URL}/api/students\`);
            const students = await res.json();
            const tbody = document.getElementById('studentList');
            if (!students || students.length === 0) {
              tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Chưa có sinh viên nào.</td></tr>';
              return;
            }
            tbody.innerHTML = students.map(s => \`
              <tr>
                <td>\${s.studentId || ''}</td>
                <td>\${s.name || ''}</td>
                <td>\${s.email || ''}</td>
              </tr>
            \`).join('');
          } catch (err) {
            console.error('Lỗi kết nối Backend:', err);
            document.getElementById('studentList').innerHTML = '<tr><td colspan="3" style="color:red; text-align:center;">Lỗi kết nối tới Backend API!</td></tr>';
          }
        }

        document.getElementById('studentForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const studentId = document.getElementById('studentId').value;
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;

          try {
            await fetch(\`\${API_URL}/api/students\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ studentId, name, email })
            });
            document.getElementById('studentForm').reset();
            loadStudents();
          } catch (err) {
            console.error('Lỗi thêm sinh viên:', err);
          }
        });

        loadStudents();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});