let proximoIdUsuario = 1;

class Usuario{
    constructor(pNombr,pApellido,pEmail,pDireccion, pPassword) {
        this.nombre= pNombr;
        this.apellido = pApellido;
        this.email = pEmail;
        this.direccion = pDireccion;
        this.password= pPassword;
        this.idUsuario= proximoIdUsuario;
    
        proximoIdUsuario++;
    }
}

class Sucursal {
    constructor(id,nombre,direccion,ciudad,pais){
        id;
        nombre;
        direccion;
        ciudad;
        pais
    }
}

class Producto {
    constructor(id,codigo,nombre,precio,urlImagen,estado) {
        id;
        codigo;
        nombre;
        precio;
        urlImagen;
        estado;
    }
}

class Pedido{
    constructor()
}