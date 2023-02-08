// // Base de datos

// let DB;
// Para obtener pantalla completa
// document.documentElement.requestFullscreen()
// document.exitFullscreen(); para salir de pantalla completa

// window.onload = () => {
//     console.log("hello world")
// }

// document.addEventListener('DOMContentLoaded', () => {
//     crearDB();

//     setTimeout(() => {
//         console.log("hello world")
//     }, 5000);
// })

// function crearDB() {
//     // creando la base de datos
//     crmDB = window.indexedDB.open('crm', 1);

//     // si hay error
//     crmDB.onerror = function () {
//         console.log("Hubo un error a la hora de crear la base de datos")
//     }

//     // si se creo bien
//     crmDB.onsuccess = function () {
//         console.log("Se creo correctamente la base de datos")

//         DB = crmDB.result;
//     }

//     // configurando la base de datos
//     crmDB.onupgradeneeded = function (e) {
//         // console.log("este metodo solo se ejecuta una VEZ")
//         const db = e.target.result;

//         const objectStore = db.createObjectStore('crm', {
//             KeyPath: 'id',
//             autoIncrement: true
//         });

//         objectStore.createIndex('nombre', 'nombre', { unique: false })
//         objectStore.createIndex('apellido', 'apellido', { unique: false })
//         objectStore.createIndex('email', 'email', { unique: true })
//         objectStore.createIndex('direccion', 'direccion', { unique: false })
//         objectStore.createIndex('id', 'id', { unique: true })
//         console.log("Columnas creadas")

//     }
// }

// const transaction = DB.transaction(['crm'], 'readwrite')

// const objectStore = transaction.objectStore('crm')

// transaction.oncomplete = function () {
//     console.log("Transaccion completada")

// }

// transaction.onerror = function () {
//     console.log("Hubo un error en la trnasaccion")
// }

// const nuevoCliente = {
//     nombre ,
//     apellido,
//     email,
//     direccion
// }

// const peticion = objectStore.add(nuevoCliente)
// console.log(peticion)



window.addEventListener('online', actualizarEstado);
window.addEventListener('offline', actualizarEstado);


function actualizarEstado() {
  if (navigator.onLine) {
    console.log("Esta conectado.")
  } else {
    console.log("No tiene internet...")
  }
}


const linkApi = "https://ort-tallermoviles.herokuapp.com/api"
let hayUsuarioLogueado = false;

inicializar();

function inicializar() {
  eventListener();
  ocultarPantallas();
  ocultarOpcionesDelMenu();
}

function eventListener() {
  document.querySelector("#registrarse").addEventListener("click", btnRegistrarseHandler);
  document.querySelector("#registro").addEventListener("click", btnRegistroHandler);
  document.querySelector("#inicio").addEventListener("click", btnInicioHandler);
  document.querySelector("#inicioSesion").addEventListener("click", inicioSesionHandler);
  document.querySelector("#btnLogin").addEventListener("click", btnLoginHandler);
  document.querySelector("#cerrarSesion").addEventListener("click", btnCerrarSesionHandler);
  document.querySelector("#btnMenuSucursales").addEventListener("click", btnMenuSucursalesHandler);

}

// Ocultar Pantallas
function ocultarPantallas() {
  document.querySelector("#registro").style.display = "none";
  document.querySelector("#login").style.display = "none";
  document.querySelector("#inicioApp").style.display = "none";
  document.querySelector("#productoSeleccionado").style.display = "none";
  document.querySelector("#sucursales").style.display = "none";

}

function ocultarOpcionesDelMenu() {
  document.querySelector("#btnMenuSucursales").style.display = "none";
  document.querySelector("#inicio").style.display = "none";
  document.querySelector("#cerrarSesion").style.display = "none";
}

function opcionesDeMenuLogeado() {
  ocultarPantallas();
  document.querySelector("#inicioApp").style.display = "block";
  document.querySelector("#inicioSesion").style.display = "none";
  document.querySelector("#productoSeleccionado").style.display = "none";
  document.querySelector("#registrarse").style.display = "none";
  document.querySelector("#inicio").style.display = "block";
  document.querySelector("#cerrarSesion").style.display = "block";
  document.querySelector("#btnMenuSucursales").style.display = "block";


}

function opcionesDeMenuNoLogeado() {
  ocultarPantallas();
  document.querySelector("#inicioSesion").style.display = "block";
  document.querySelector("#registrarse").style.display = "block";
  document.querySelector("#inicio").style.display = "none";
  document.querySelector("#cerrarSesion").style.display = "none";
  document.querySelector("#btnMenuSucursales").style.display = "none";

}

function btnRegistrarseHandler() {
  ocultarPantallas();
  document.querySelector("#registro").style.display = "block";
}
function inicioSesionHandler() {
  ocultarPantallas();
  document.querySelector("#login").style.display = "block";
}

function btnInicioHandler() {
  ocultarPantallas();
  document.querySelector("#inicioApp").style.display = "block";
}

function btnCerrarSesionHandler() {
  opcionesDeMenuNoLogeado();
  hayUsuarioLogueado = false;
  localStorage.removeItem("usuarioApp")
}

// INICIO SESION
function btnLoginHandler(e) {
  e.preventDefault();

  let emailIngresado = document.querySelector("#loginEmail").value;
  let contraseñaIngresada = document.querySelector("#loginPassword").value;
  let email = emailIngresado.toLowerCase();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: contraseñaIngresada,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(linkApi + "/usuarios/session", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.error == "") {
        // los datos son validos
        document.querySelector("#mensajeLogin").innerHTML = "";
        opcionesDeMenuLogeado();
        hayUsuarioLogueado = true;
        localStorage.setItem("usuarioApp", JSON.stringify(result.data))
        obtenerProductos();
      } else {
        document.querySelector("#mensajeLogin").innerHTML = result.error;
      }
    })
    .catch((error) => console.log("error", error));

}

function elUsuarioIniciaSesion() {

}



// REGISTRO

function btnRegistroHandler(e) {
  e.preventDefault();
  let nombre = document.querySelector("#nombre").value;
  let apellido = document.querySelector("#apellido").value;
  let email = document.querySelector("#email").value;
  let direccion = document.querySelector("#direccion").value;
  let password = document.querySelector("#RegistroPassword").value;
  let confPassword = document.querySelector("#RegistroPassword2").value;
  let mensaje = "";

  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  try {

    if (nombre == "") {
      throw new Error("El nombre es obligatorio");
    }
    if (apellido == "") {
      throw new Error("El apellido es obligatorio");
    }
    if (!emailRegex.test(email)) {
      throw new Error("El emai ingresado no es valido");
    }
    if (direccion == null || direccion == "") {
      throw new Error("La direccion es obligatoria");
    }
    // trim te elimina los espacios vacios
    if (password.trim().length < 8 || password.trim().length > 20) {
      throw new Error("Contrasenia mínimo de 8 y máximo de 20 caracteres ");
    }
    if (password !== confPassword) {
      throw new Error("Las contrasenias deben ser las mismas");
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      nombre: nombre,
      apellido: apellido,
      email: email,
      direccion: direccion,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(linkApi + "/usuarios", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        console.log("usuario creado correctamente")
        mensaje = `${nombre} tu usario se creo correctamente. Prueba iniciar sesion`;
        document.getElementById("formRegistro").reset();

      })
      .catch((error) => console.log("error", error));

  } catch (Error) {
    mensaje = Error.message;
  }

  document.querySelector("#mensajeRegistro").innerHTML = mensaje;
}

// PRODUCTOS
function obtenerProductos() {

  let usu = JSON.parse(localStorage.getItem('usuarioApp'));

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-auth", usu.token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(linkApi + "/productos", requestOptions)
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      const divProductos = document.getElementById("divProductos");
      data.data.forEach(producto => {
        divProductos.innerHTML += `
          <div class="card col-12 col-md-4" >
            <img src="https://ort-tallermoviles.herokuapp.com/assets/imgs/${producto.urlImagen}.jpg" class="card-img-top img-fluid" alt="...">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">Precio$${producto.precio}</p>
              <p>${producto.codigo}</p> <a>${producto.etiquetas}</a> <a>${producto.estado}</a>
              <a href="#" class="btn btn-primary text-center btncomprarProducto" data-id="${producto._id}">Comprar</a>
            </div>
          </div>
        `;

      });

      agregarEventosDeClickEnButtonsDinamicos(".btncomprarProducto", seleccionDelProducto);

    })

  .catch(error => console.log('error', error));

}


// Producto
function seleccionDelProducto() {

  let idProducto = this.getAttribute("data-id");

  let usu = JSON.parse(localStorage.getItem('usuarioApp'));


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-auth", usu.token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(linkApi + "/productos/" + idProducto, requestOptions)
    .then(response => response.json())
    .then((data) => {
      let producto = data.data;
      ocultarPantallas();
      document.querySelector("#productoSeleccionado").style.display = "block";
      document.querySelector("#productoSeleccionado").innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text"><small class="text-muted">puntuacion ${producto.puntaje} precio$${producto.precio}</small></p>
          </div>  
          <img src="https://ort-tallermoviles.herokuapp.com/assets/imgs/${producto.urlImagen}.jpg" class="card-img-bottom img-fluid" alt="...">
        </div>

        <a class="btn btn-primary btnvolverAlInicioHandler  mb-5 mt-2">volver</a>

      `;

      agregarEventosDeClickEnButtonsDinamicos(".btnvolverAlInicioHandler", btnvolverAlInicioHandler)

    })
    .catch(error => console.log('error', error));

}
// TODO
function mostrarProducto() {

}

function btnvolverAlInicioHandler() {
  ocultarPantallas();
  document.querySelector("#inicioApp").style.display = "block";
}

function btnMenuSucursalesHandler() {
  console.log("hello")
  obtenerTodasLasSucursales()
}


function obtenerTodasLasSucursales() {
  let usu = JSON.parse(localStorage.getItem('usuarioApp'));

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-auth", usu.token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(linkApi + "/sucursales", requestOptions)
    .then(response => response.json())
    .then(result => {

      mostrarSucursales(result);

      localStorage.setItem("sucursales", JSON.stringify(result.data))

    })
    .catch(error => console.log('error', error));
}

function mostrarSucursales(array) {

  let select = document.querySelector("#comboSucursales");
  select.innerHTML = "";
  ocultarPantallas();
  document.querySelector("#sucursales").style.display = "block"

  let sucursales = JSON.parse(localStorage.getItem('sucursales'));


  if (sucursales == null) {
    array.data.map(sucursal => {
      select.innerHTML += `
        <option value="${sucursal._id}">${sucursal.nombre}hello</option>
      `;
    });

  } else {
    sucursales.map(sucursal => {
      document.querySelector("#comboSucursales").innerHTML += `
        <option value="${sucursal._id}">${sucursal.nombre}hello</option>
      `;
    });
  }


}

// LOCAL STORAGE

function validarSiElUsuarioEstaLogeado() {
  // retorna null o true
  if (localStorage.getItem("usuarioAPP")) {
    hayUsuarioLogueado = true;
  }
}


// Funciones Generales

function agregarEventosDeClickEnButtonsDinamicos(clase, funcion) {
  // obtengo todos los bottones con esa class
  let arrayDeBotones = document.querySelectorAll(`${clase}`);
  //le agrego evento de click a todos los bottones
  for (let i = 0; i < arrayDeBotones.length; i++) {
    botonActual = arrayDeBotones[i];
    botonActual.addEventListener("click", funcion);
  }
}


