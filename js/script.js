// Datos de ejemplo
let users = [
    { id: 1, username: 'admin1', email: 'admin1@example.com', role: 'admin' },
    { id: 2, username: 'aux1', email: 'aux1@example.com', role: 'auxiliar' },
    { id: 3, username: 'tec1', email: 'tec1@example.com', role: 'tecnico' },
    { id: 4, username: 'guest1', email: 'guest1@example.com', role: 'guest' }
];

let currentRole = null;

// Elementos del DOM
const mainMenu = document.getElementById('mainMenu');
const userSection = document.getElementById('userSection');
const userTypeTitle = document.getElementById('userTypeTitle');
const menuBtns = document.querySelectorAll('.menu-btn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const modal = document.getElementById('userModal');
const modalTitle = document.getElementById('modalTitle');
const userForm = document.getElementById('userForm');
const createUserBtn = document.getElementById('createUserBtn');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');
const usersTableBody = document.getElementById('usersTableBody');
const roleSelect = document.getElementById('role');
const readUserModal = document.getElementById('readUserModal');
const closeReadBtn = document.querySelector('.close-read');
const readUserInfo = document.getElementById('readUserInfo');

// Funciones
function showMenu() {
    userSection.style.display = 'none';
    mainMenu.style.display = 'block';
}

function showUserSection(role) {
    currentRole = role;
    mainMenu.style.display = 'none';
    userSection.style.display = 'block';
    userTypeTitle.textContent = `Usuarios tipo: ${capitalize(role)}`;
    roleSelect.value = role;
    renderUsers();
}

function showModal(title) {
    modalTitle.textContent = title;
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
    userForm.reset();
}

function renderUsers() {
    usersTableBody.innerHTML = '';
    users.filter(user => user.role === currentRole).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${capitalize(user.role)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})">Editar</button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function createUser(userData) {
    const newUser = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...userData
    };
    users.push(newUser);
    renderUsers();
}

window.editUser = function(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        showModal('Editar Usuario');
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        roleSelect.value = user.role;
        
        // Modificar el formulario para actualizar en lugar de crear
        userForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(userForm);
            const updatedUser = {
                id: user.id,
                username: formData.get('username'),
                email: formData.get('email'),
                role: currentRole
            };
            users = users.map(u => u.id === user.id ? updatedUser : u);
            renderUsers();
            hideModal();
        };
    }
}

window.deleteUser = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        users = users.filter(user => user.id !== id);
        renderUsers();
    }
}

window.readUser = function(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        readUserInfo.innerHTML = `
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Usuario:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${capitalize(user.role)}</p>
        `;
        readUserModal.style.display = 'block';
    }
}

// Event Listeners
menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showUserSection(btn.getAttribute('data-role'));
    });
});

backToMenuBtn.addEventListener('click', showMenu);

createUserBtn.addEventListener('click', () => {
    showModal('Crear Nuevo Usuario');
    userForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(userForm);
        createUser({
            username: formData.get('username'),
            email: formData.get('email'),
            role: currentRole
        });
        hideModal();
    };
});

cancelBtn.addEventListener('click', hideModal);
closeBtn.addEventListener('click', hideModal);
closeReadBtn.addEventListener('click', () => {
    readUserModal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
    if (e.target === readUserModal) {
        readUserModal.style.display = 'none';
    }
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Inicializar menú principal
showMenu(); 