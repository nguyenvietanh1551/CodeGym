let students = [];

function displayStudents() {
    let html = `<table>
    <tr>
      <th>Mã HV</th>
      <th>Tên</th>
      <th>Lớp</th>
      <th>Email</th>
      <th>Ngày sinh</th>
    </tr>`;

    for (let s of students) {
        html += `<tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.className}</td>
      <td>${s.email}</td>
      <td>${s.birth}</td>
    </tr>`;
    }

    html += `</table>`;
    document.getElementById("studentTable").innerHTML = html;
}

function validateStudent(id, name, birth) {
    const idRegex = /^HV-\d{4}$/;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!idRegex.test(id)) return "Mã học viên không đúng định dạng HV-XXXX";
    if (students.some(s => s.id === id)) return "Mã học viên đã tồn tại";
    if (name.length > 50) return "Tên học viên không được quá 50 ký tự";
    if (!dateRegex.test(birth)) return "Ngày sinh không đúng định dạng dd/MM/yyyy";

    return null;
}

function addStudent() {
    const id = prompt("Nhập mã học viên (HV-XXXX):");
    const name = prompt("Nhập tên học viên:");
    const className = prompt("Nhập lớp:");
    const email = prompt("Nhập email:");
    const birth = prompt("Nhập ngày sinh (dd/MM/yyyy):");

    const error = validateStudent(id, name, birth);
    if (error) {
        alert(error);
        return;
    }

    students.push({ id, name, className, email, birth });
    displayStudents();
}

function editStudent() {
    const id = prompt("Nhập mã học viên cần sửa:");
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        alert("Mã học viên không tồn tại");
        return;
    }

    const name = prompt("Nhập tên mới:");
    const className = prompt("Nhập lớp mới:");
    const email = prompt("Nhập email mới:");
    const birth = prompt("Nhập ngày sinh mới (dd/MM/yyyy):");

    if (name.length > 50) {
        alert("Tên học viên không được quá 50 ký tự");
        return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birth)) {
        alert("Ngày sinh không đúng định dạng dd/MM/yyyy");
        return;
    }

    students[index] = { id, name, className, email, birth };
    displayStudents();
}

function deleteStudent() {
    const id = prompt("Nhập mã học viên cần xóa:");
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        alert("Mã học viên không tồn tại");
        return;
    }

    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmDelete) {
        students.splice(index, 1);
        displayStudents();
    }
}

// Khởi tạo hiển thị ban đầu
displayStudents();
