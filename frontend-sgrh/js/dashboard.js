// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = 'https://sgrh-sistema-gestion-recursos-humanos.onrender.com';

// ============================================
// INICIALIZAR DASHBOARD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando Dashboard...');
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    window.location.href = 'index.html';
    return;
  }
  
  // Mostrar usuario
  const user = userStr ? JSON.parse(userStr) : { email: 'Usuario', role: role };
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userRole').textContent = role ? role.toUpperCase() : 'USER';
  
  // Mostrar panel admin solo si es admin
  if (role && role.toLowerCase() === 'admin') {
    document.getElementById('adminPanel').classList.remove('d-none');
    document.querySelectorAll('[id^="btnCrear"]').forEach(btn => {
      btn.classList.remove('d-none');
    });
  }
  
  loadEmpleados();
});

// ============================================
// FUNCIÓN GENÉRICA PARA REQUESTS
// ============================================
async function apiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  if (body) options.body = JSON.stringify(body);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (response.status === 401) {
      alert('⚠️ Sesión expirada');
      logout();
      return null;
    }
    if (response.status === 403) {
      alert('🚫 No tienes permisos (403)');
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
    return null;
  }
}

// ============================================
// CARGAR DATOS
// ============================================
async function loadEmpleados() {
  document.getElementById('tablaTitulo').textContent = '👥 Empleados';
  const data = await apiRequest('/empleados');
  renderTable(data, 'empleados');
}

async function loadCargos() {
  document.getElementById('tablaTitulo').textContent = '📋 Cargos';
  const data = await apiRequest('/cargo');
  renderTable(data, 'cargo');
}

async function loadDepartamentos() {
  document.getElementById('tablaTitulo').textContent = '🏢 Departamentos';
  const data = await apiRequest('/departamento');
  renderTable(data, 'departamento');
}

async function loadTiposDocumento() {
  document.getElementById('tablaTitulo').textContent = '📄 Tipos de Documento';
  const data = await apiRequest('/tipo-documento');
  renderTable(data, 'tipo-documento');
}

// ============================================
// RENDERIZAR TABLA CON BOTONES CRUD
// ============================================
function renderTable(data, modulo) {
  console.log('📊 Renderizando tabla para:', modulo);
  
  const table = document.getElementById('dataTable');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  thead.innerHTML = '';
  tbody.innerHTML = '';
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted">No hay datos</td></tr>';
    return;
  }
  
  // Verificar si es admin
  const role = localStorage.getItem('role');
  const esAdmin = role && role.toLowerCase() === 'admin';
  
  // Encabezados
  let headerRow = '<tr>';
  Object.keys(data[0]).forEach(key => {
    headerRow += `<th>${formatKey(key)}</th>`;
  });
  if (esAdmin) headerRow += '<th>Acciones</th>';
  headerRow += '</tr>';
  thead.innerHTML = headerRow;
  
  // Filas
  data.forEach(row => {
    let dataRow = '<tr>';
    
    Object.entries(row).forEach(([key, value]) => {
      let displayValue = value;
      
      // ✅ Manejar valores nulos
      if (value === null || value === undefined) {
        displayValue = '-';
      }
      // ✅ Manejar objetos anidados (Cargo, Departamento, TipoDocumento)
      else if (typeof value === 'object') {
        // Extraer el nombre del objeto si existe
        displayValue = value.nombre || 
                       value.nombre_cargo || 
                       value.nombre_departamento || 
                       value.nombre_tipo_documento || 
                       value.descripcion || 
                       JSON.stringify(value).substring(0, 30) + '...';
      }
      
      dataRow += `<td>${displayValue}</td>`;
    });
    
    // 🔍 Obtener el ID correcto según la estructura
    const id = row.id || 
               row.id_empleado || 
               row.id_tipo_documento || 
               row.id_cargo || 
               row.id_departamento;
    
    console.log('🔍 ID encontrado:', id, 'Para fila:', row);
    
    // Botones de acción solo para admin Y si hay ID
    if (esAdmin && id) {
      let funcionEditar = '';
      if (modulo === 'empleados') funcionEditar = 'editarEmpleado';
      else if (modulo === 'cargo') funcionEditar = 'editarCargo';
      else if (modulo === 'departamento') funcionEditar = 'editarDepartamento';
      else if (modulo === 'tipo-documento') funcionEditar = 'editarTipoDocumento';
      
      dataRow += `
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="${funcionEditar}(${id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminar('${modulo}', ${id})">🗑️ Eliminar</button>
        </td>
      `;
    } else if (esAdmin) {
      dataRow += '<td>-</td>';
    }
    
    dataRow += '</tr>';
    tbody.innerHTML += dataRow;
  });
  
  // Guardar datos para el buscador
  window.datosActuales = data;
  window.moduloActual = modulo;
}
// ============================================
// BUSCADOR
// ============================================
function buscarEnTabla() {
  const texto = document.getElementById('buscador')?.value.toLowerCase() || '';
  const datos = window.datosActuales || [];
  const modulo = window.moduloActual || 'empleados';
  
  if (!texto) {
    renderTable(datos, modulo);
    return;
  }
  
  const filtrados = datos.filter(row => {
    return Object.values(row).some(valor => {
      if (valor === null || valor === undefined) return false;
      return String(valor).toLowerCase().includes(texto);
    });
  });
  
  renderTable(filtrados, modulo);
}

// ============================================
// EMPLEADOS - CREATE
// ============================================
function crearEmpleado() {
  document.getElementById('modalEmpleadoTitulo').textContent = '➕ Nuevo Empleado';
  document.getElementById('formEmpleado').reset();
  document.getElementById('empId').value = '';
  new bootstrap.Modal(document.getElementById('modalEmpleado')).show();
}


// ============================================
// EMPLEADOS - READ (para editar)
// ============================================
async function editarEmpleado(id) {
  console.log('✏️ Editando empleado ID:', id);
  document.getElementById('modalEmpleadoTitulo').textContent = '✏️ Editar Empleado';
  
  const data = await apiRequest(`/empleados/${id}`);
  if (data) {
    console.log('📦 Datos cargados:', data);
    
    document.getElementById('empId').value = data.id || data.id_empleado || id;
    document.getElementById('empNombres').value = data.nombres || '';
    document.getElementById('empApellidos').value = data.apellidos || '';
    document.getElementById('empNumeroDocumento').value = data.numero_documento || '';
    document.getElementById('empIdTipoDocumento').value = data.id_tipo_documento || 1;
    document.getElementById('empFechaNacimiento').value = data.fecha_nacimiento || '';
    document.getElementById('empDireccion').value = data.direccion || '';
    document.getElementById('empTelefono').value = data.telefono || '';
    document.getElementById('empCorreo').value = data.correo || '';
    document.getElementById('empEstadoCivil').value = data.estado_civil || 'Soltero';
    document.getElementById('empFechaIngreso').value = data.fecha_ingreso || '';
    document.getElementById('empIdCargo').value = data.id_cargo || 1;
    document.getElementById('empIdDepartamento').value = data.id_departamento || 1;
    
    new bootstrap.Modal(document.getElementById('modalEmpleado')).show();
  }
}
// ============================================
// EMPLEADOS - UPDATE/CREATE
// ============================================
async function guardarEmpleado() {
  const id = document.getElementById('empId').value;
  
  // ✅ Campos correctos según CreateEmpleadoDto
  const empleado = {
    nombres: document.getElementById('empNombres').value,
    apellidos: document.getElementById('empApellidos').value,
    numero_documento: document.getElementById('empNumeroDocumento').value,
    id_tipo_documento: parseInt(document.getElementById('empIdTipoDocumento').value),
    fecha_nacimiento: document.getElementById('empFechaNacimiento').value,
    direccion: document.getElementById('empDireccion').value,
    telefono: document.getElementById('empTelefono').value,
    correo: document.getElementById('empCorreo').value,
    estado_civil: document.getElementById('empEstadoCivil').value,
    fecha_ingreso: document.getElementById('empFechaIngreso').value,
    id_cargo: parseInt(document.getElementById('empIdCargo').value),
    id_departamento: parseInt(document.getElementById('empIdDepartamento').value),
  };
  
  console.log('💾 Guardando empleado:', empleado);
  
  const endpoint = id ? `/empleados/${id}` : '/empleados';
  const method = id ? 'PATCH' : 'POST';
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(empleado),
    });
    
    const data = await response.json();
    console.log('📥 Respuesta:', response.status, data);
    
    if (response.ok || response.status === 201) {
      alert(id ? '✅ Empleado actualizado' : '✅ Empleado creado');
      bootstrap.Modal.getInstance(document.getElementById('modalEmpleado')).hide();
      await loadEmpleados();
    } else {
      alert('❌ Error: ' + (data.message || JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
} 
// CARGOS - CREATE
// ============================================
function crearCargo() {
  document.getElementById('modalCargoTitulo').textContent = '➕ Nuevo Cargo';
  document.getElementById('formCargo').reset();
  document.getElementById('cargoId').value = '';
  new bootstrap.Modal(document.getElementById('modalCargo')).show();
}

// ============================================

// CARGOS - READ (para editar)
// ============================================
async function editarCargo(id) {
  console.log('✏️ Editando cargo ID:', id);
  document.getElementById('modalCargoTitulo').textContent = '✏️ Editar Cargo';
  const data = await apiRequest(`/cargo/${id}`);
  if (data) {
    document.getElementById('cargoId').value = data.id || data.id_cargo || id;
    document.getElementById('cargoNombre').value = data.nombre || '';
    document.getElementById('cargoDescripcion').value = data.descripcion || '';
    new bootstrap.Modal(document.getElementById('modalCargo')).show();
  }
}


// ============================================
// CARGOS - UPDATE/CREATE
// ============================================
async function guardarCargo() {
  const id = document.getElementById('cargoId').value;
  
  // ✅ Campos correctos según el DTO del backend
  const cargo = {
    nombre_cargo: document.getElementById('cargoNombre').value,
  };
  
  console.log('💾 Guardando cargo:', cargo);
  
  const endpoint = id ? `/cargo/${id}` : '/cargo';
  const method = id ? 'PATCH' : 'POST';
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cargo),
    });
    
    const data = await response.json();
    console.log('📥 Respuesta:', response.status, data);
    
    if (response.ok || response.status === 201) {
      alert(id ? '✅ Cargo actualizado' : '✅ Cargo creado');
      bootstrap.Modal.getInstance(document.getElementById('modalCargo')).hide();
      await loadCargos();
    } else {
      alert('❌ Error: ' + (data.message || JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}


// ============================================
// DEPARTAMENTOS - CREATE
// ============================================
function crearDepartamento() {
  document.getElementById('modalDepartamentoTitulo').textContent = '➕ Nuevo Departamento';
  document.getElementById('formDepartamento').reset();
  document.getElementById('deptId').value = '';
  new bootstrap.Modal(document.getElementById('modalDepartamento')).show();
}

// ============================================
// DEPARTAMENTOS - READ (para editar)
// ============================================

async function editarDepartamento(id) {
  console.log('✏️ Editando departamento ID:', id);
  document.getElementById('modalDepartamentoTitulo').textContent = '✏️ Editar Departamento';
  const data = await apiRequest(`/departamento/${id}`);
  if (data) {
    document.getElementById('deptId').value = data.id || data.id_departamento || id;
    document.getElementById('deptNombre').value = data.nombre || '';
    document.getElementById('deptDescripcion').value = data.descripcion || '';
    new bootstrap.Modal(document.getElementById('modalDepartamento')).show();
  }
}

// ============================================
// DEPARTAMENTOS - UPDATE/CREATE
// ============================================
async function guardarDepartamento() {
  const id = document.getElementById('deptId').value;
  
  // ✅ Campos correctos según el DTO del backend
  const dept = {
    nombre_departamento: document.getElementById('deptNombre').value,
  };
  
  console.log('💾 Guardando departamento:', dept);
  
  const endpoint = id ? `/departamento/${id}` : '/departamento';
  const method = id ? 'PATCH' : 'POST';
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dept),
    });
    
    const data = await response.json();
    console.log('📥 Respuesta:', response.status, data);
    
    if (response.ok || response.status === 201) {
      alert(id ? '✅ Departamento actualizado' : '✅ Departamento creado');
      bootstrap.Modal.getInstance(document.getElementById('modalDepartamento')).hide();
      await loadDepartamentos();
    } else {
      alert('❌ Error: ' + (data.message || JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}



// ============================================
// TIPOS DOCUMENTO - CREATE
// ============================================
function crearTipo() {
  document.getElementById('modalTipoTitulo').textContent = '➕ Nuevo Tipo Documento';
  document.getElementById('formTipoDocumento').reset();
  document.getElementById('tipoId').value = '';
  new bootstrap.Modal(document.getElementById('modalTipoDocumento')).show();
}



// ============================================
// TIPOS DOCUMENTO - READ (para editar)
// ============================================
async function editarTipoDocumento(id) {
  console.log('✏️ Editando tipo documento ID:', id);
  document.getElementById('modalTipoTitulo').textContent = '✏️ Editar Tipo Documento';
  
  const data = await apiRequest(`/tipo-documento/${id}`);
  if (data) {
    console.log('📦 Datos cargados:', data);
    document.getElementById('tipoId').value = data.id || data.id_tipo_documento || id;
    document.getElementById('tipoNombre').value = data.nombre_tipo || '';
    document.getElementById('tipoDescripcion').value = data.descripcion_tipo || '';
    new bootstrap.Modal(document.getElementById('modalTipoDocumento')).show();
  }
}

// ============================================
// TIPOS DOCUMENTO - UPDATE/CREATE
// ============================================
async function guardarTipo() {
  const id = document.getElementById('tipoId').value;
  
  // ✅ Campos correctos según el DTO del backend
  const tipo = {
    nombre_tipo_documento: document.getElementById('tipoNombre').value,
    descripcion: document.getElementById('tipoDescripcion').value,
  };
  
  console.log('💾 Guardando tipo:', tipo);
  
  // Validar que no esté vacío
  if (!tipo.nombre_tipo_documento || !tipo.descripcion) {
    alert('⚠️ El nombre y la descripción son obligatorios');
    return;
  }
  
  const endpoint = id ? `/tipo-documento/${id}` : '/tipo-documento';
  const method = id ? 'PATCH' : 'POST';
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tipo),
    });
    
    const data = await response.json();
    console.log('📥 Respuesta:', response.status, data);
    
    if (response.ok || response.status === 201) {
      alert(id ? '✅ Tipo actualizado' : '✅ Tipo creado');
      bootstrap.Modal.getInstance(document.getElementById('modalTipoDocumento')).hide();
      await loadTiposDocumento();
    } else {
      alert('❌ Error: ' + (data.message || JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error de conexión');
  }
}

// ============================================
// ELIMINAR REGISTRO
// ============================================
async function eliminar(modulo, id) {
  if (!confirm(`⚠️ ¿Estás seguro de eliminar este registro?`)) return;
  
  const endpoints = {
    'empleados': '/empleados',
    'cargo': '/cargo',
    'departamento': '/departamento',
    'tipo-documento': '/tipo-documento'
  };
  
  const result = await apiRequest(`${endpoints[modulo]}/${id}`, 'DELETE');
  if (result) {
    alert('✅ Eliminado exitosamente');
    if (modulo === 'empleados') loadEmpleados();
    else if (modulo === 'cargo') loadCargos();
    else if (modulo === 'departamento') loadDepartamentos();
    else if (modulo === 'tipo-documento') loadTiposDocumento();
  }
}

// ============================================
// UTILIDADES
// ============================================
function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}
