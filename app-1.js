// TDA:
// Instalar y ejecutar Express
// Instanciar servidor local
// Solicitudes por GET
// Uso de params y query
// Solicitudes por POST
// Uso de body
// Validaciones Javascript de body por el usuario
// Validaciones con modulo Join
// Solicitudes por PUT
 


// Dependencias
const express = require('express');
const Joi = require('joi');

const app = express();

// Middleware para parsear la información que llega desde el body (post) a JSON
app.use(express.json());



const usuarios = [
    {
        id: 1,
        nombre: 'Nico'
    },   
    {
        id: 2,
        nombre: 'Nacho'
    },
    {
        id: 3,
        nombre: 'Fran'
    }
];



// Rutas Ejemplo GET, con params y query
app.get('/', (req,res) => {
    res.send('Hola Mundo desde Express.')
});
app.get('/api/usuarios', (req,res) => {
    res.send(usuarios);
});
app.get('/api/usuarios/:year/:mes', (req,res) => {
    res.send(req.params);
});
app.get('/api/usuarios/:year/:mes', (req,res) => {
    // comentar linea 15 y en la url del navegador agregar ?sexo=M
    res.send(req.query);
});




// Petición HTTP GET
app.get('/api/usuarios/:id', (req,res) => {
    let usuario = usuarios.find(user => user.id === parseInt(req.params.id));
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});








// Petición HTTP POST validando con Javascript
// app.post('/api/usuarios', (req,res) => {

//     if (!req.body.nombre || req.body.nombre.length <= 2) {
//         // 400 es Bad Request
//         res.status(400).send('Debe ingresar un nombre y que tenga mínimo 3 letras');
//         return;
//     }

//     const usuario = {
//         id: usuarios.length + 1,
//         nombre: req.body.nombre
//     }
//     usuarios.push(usuario);
//     res.send(usuarios);
// });


// // Petición HTTP POST validando con modulo Joi
app.post('/api/usuarios', (req,res) => {

    // 1 - Definir el schema (objeto con elementos a validar)
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(8).case('lower').required()
    });

    // 2 - Validar el schema
    // const result = schema.validate({ nombre: req.body.nombre });
    // console.log(result);
    // Result contiene un objeto literal con value y error (ambos objetos literales). Aplico destructuring
    const {value, error} = schema.validate({ nombre: req.body.nombre });
    
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);        
    } else {
        // Imprimo el error para ver como se compone y como manipularlo
        // res.status(400).send(error);
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});









// Petición HTTP PUT
app.put('/api/usuarios/:id', (req,res) => {
    // 1 - Encontrar si existe el objeto usuario a modificar
    // let usuario = usuarios.find(user => user.id === parseInt(req.params.id));
    let usuario =  usuarios.find(user => user.id === parseInt(req.params.id));
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }        

    // 2 - Validar si el dato es correcto
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(8).case('lower').required()
    });

    const {value, error} = schema.validate({ nombre: req.body.nombre });
    
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);   
        return;
    }

    // 3 - Actualizar
    // usuario.nombre = req.body.nombre;
    usuario.nombre = value.nombre;
    res.send(usuario);
});












// Servidor local
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}...`);
});