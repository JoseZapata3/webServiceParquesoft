//Se importan todas las dependencias
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//Se decalran constantes
const app = express();
const mongoUri = process.env.MONGO_URI;

//Se realiza conexión a base de datos
try{
    mongoose. connect(mongoUri);
    console.log('Conexión exitosa!');
}catch(error){
    console.error(error);
}

//Se define el esquema que va tener el libro (si fuera una tabla realcional, se asociaria a la tabla)
const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String
});

//Se crea un modelo, es como si fuera una clase, basada en los atributos del schema anteriormnete definido
const Libro = mongoose.model("Libro",libroSchema);

//Se agregan los middlewares
app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
    const authToken = req.headers["authorization"];

    if(authToken === "tokenSecreto") next()
    else res.status(401).send('Acceso no autorizado');
});

//Se crea una ruta raiz
app.get('/api',(req,res)=>{
    res.send("Bienvenido al app de libros");
});


//Ruta para obtener libros creados (Se pueden crear ruta con el mismo y el nombre, siempre y cuando sean metodos diferentes - POST-GET-PUT-DELETE)
app.get('/api/libros',async (req,res)=>{
    try{
        const libros = await Libro.find();
        res.json(libros);
    }catch(error){
        res.send(500).send('Error al obtener los libros');
    }
});

//Ruta para buscar un libro por titulo, usadon query
app.get('/api/librotitulo',async (req,res)=>{
    try{
        const titulo = req.query.titulo;
        const libro = await Libro.findOne({titulo: titulo});

        if(libro) res.json(libro)
        else res.status(404).send('Libro no encontrado');
    }catch(error){
        res.send(500).send('Error al buscar el libro');
    }
});

//Ruta para buscar un libro por id, usadon params
app.get('/api/libros/:id', async (req,res)=>{
    try{
        const libro = await Libro.findById(req.params.id);

        if(libro) res.json(libro);
        else res.status(404).send('Libro no encontrado');
    }catch(error){
        res.send(500).send('Error al buscar el libro');
    }

});

//Ruta para la creación de libros en mongodb
app.post('/api/libros', async (req,res)=>{
    //Se crea un objeto nuevo, en base al modelo de Libro, que hace de clase
    const libro = new Libro({
        titulo: req.body.titulo,
        autor: req.body.autor,
    });

    try{
        await libro.save();
        res.json(libro);
    }catch(error){
        res.send(500).send('Error en la creación el libro');
    }
});

//Ruta para la actualización de un libro
app.put('/api/libros/:id',async (req,res)=>{
    try{
        const libro = await Libro.findByIdAndUpdate(req.params.id, {
            titulo: req.body.titulo,
            autor: req.body.autor,
        },{
            new:true // Esta opción hará que se devuelva el documento actualizado
        });

        if(libro) res.json(libro);
        else res.status(404).send('Libro no encontrado'); 

    }catch(error){
        res.send(500).send('Error al actulizar el libro');
    }
});

//Ruta para eliminar un libro por id
app.delete('api/libros/:id',async (req,res)=>{
    try{const libro = await Libro.findByIdAndDelete(req.params.id);
        if(libro) res.status(204).send();
        else res.status(404).send('Libro no encontrado'); 
    }catch(error){
        res.send(500).send('Error al eliminar el libro');
    }
});


module.exports = app;