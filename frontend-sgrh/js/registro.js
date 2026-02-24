// ============================================
// CONFIGURACIÓN DE LA API
// ============================================
const API_URL = 'http://localhost:3000';

// ============================================
// ============================================
// MANEJO DEL FORMULARIO DE REGISTRO
// ============================================
document.getElementById('registroForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // ✅ Obtener el nombre también
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Ocultar mensajes previos
  errorDiv.classList.add('d-none');
  successDiv.classList.add('d-none');
  
  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    errorDiv.textContent = '❌ Las contraseñas no coinciden';
    errorDiv.classList.remove('d-none');
    return;
  }
  
  // Validar longitud de contraseña
  if (password.length < 6) {
    errorDiv.textContent = '❌ La contraseña debe tener al menos 6 caracteres';
    errorDiv.classList.remove('d-none');
    return;
  }
  
  // Mostrar estado de carga
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrando...';
  
  console.log('📝 Intentando registro con:', { name, email });
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      // ✅ Enviar name, email y password
      body: JSON.stringify({ 
        name,
        email, 
        password 
      }),
    });
    
    const data = await response.json();
    console.log('📡 Respuesta del servidor:', data);
    
    if (response.ok || response.status === 201) {
      // ✅ Registro exitoso
      successDiv.textContent = '✅ Usuario registrado exitosamente. Ahora puedes iniciar sesión.';
      successDiv.classList.remove('d-none');
      
      // Limpiar formulario
      document.getElementById('registroForm').reset();
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      // ❌ Mostrar error
      console.error('❌ Error en registro:', data);
      errorDiv.textContent = data.message || '❌ Error al registrar usuario. El email ya puede estar en uso.';
      errorDiv.classList.remove('d-none');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    errorDiv.textContent = '❌ Error de conexión con el servidor. Verifica que el backend esté ejecutándose.';
    errorDiv.classList.remove('d-none');
  } finally {
    // Restaurar botón
    submitBtn.disabled = false;
    submitBtn.innerHTML = '📝 Registrarse';
  }
});