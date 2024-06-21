//Se levanta el servidor en el puerto 3000
const app = require('../src/index.js')
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Servidor escuchando en el puerto ",port);
});

module.exports = app;