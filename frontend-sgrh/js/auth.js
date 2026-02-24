// ============================================
// MANEJO DEL FORMULARIO DE LOGIN
// ============================================
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('errorMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Mostrar estado de carga
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Iniciando...';
  errorDiv.classList.add('d-none');
  
  console.log('🔐 Intentando login con:', email);
  
  try {
    const API_URL = 'http://localhost:3000';
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('📡 Respuesta del servidor:', data);
    
    if (response.ok) {
      // ✅ Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('user', JSON.stringify({ email, role: data.role }));
      
      console.log('✅ Login exitoso. Token y rol guardados.');
      console.log('👤 Rol del usuario:', data.role);
      
      // ✅ Redirigir al dashboard
      window.location.href = 'dashboard.html';
    } else {
      // ❌ Mostrar error
      console.error('❌ Error en login:', data.message);
      errorDiv.textContent = data.message || 'Credenciales incorrectas';
      errorDiv.classList.remove('d-none');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    errorDiv.textContent = '❌ Error de conexión con el servidor.';
    errorDiv.classList.remove('d-none');
  } finally {
    // Restaurar botón
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🚀 Iniciar Sesión';
  }
});

// ============================================
// FUNCIÓN DE LOGOUT
// ============================================
function logout() {
  console.log('🚪 Cerrando sesión...');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ============================================
// VERIFICAR SI ESTÁ AUTENTICADO
// ============================================
function isAuthenticated() {
  const token = localStorage.getItem('token');
  return token !== null;
}

// ============================================
// OBTENER TOKEN
// ============================================
function getToken() {
  return localStorage.getItem('token');
}

// ============================================
// OBTENER ROL DEL USUARIO
// ============================================
function getUserRole() {
  return localStorage.getItem('role');
}

// ============================================
// OBTENER DATOS DEL USUARIO
// ============================================
function getUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
}
