const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

//motor de platilla
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');

app.use(express.static(__dirname + "/public"));

app.use('/', require('./router/RutaWeb'));
app.use('/investigadores', require('./router/Investigadores'));


/*
app.get("/", (req, res) => {
  res.render("index", {Titulo: "mi titulo dinamico"});
});

app.get('/servicios', (req, res) => {
    res.render('servicios', {TituloServicios:"Este es el titulo de los servicios"});
})

app.get('/ayuda', (req, res) => {
  res.render('ayuda');
})

app.get('/acerca_de', (req, res) => {

  res.render('acerca_de');
})

app.get('/contacto', (req, res) => {

  res.render('contacto');
})
*/

app.use((req, res, next) => {
    res.status(404).render('404', {
        TituloError: "Ocurrio un error inesperado 404",
        DescripcionError: "El error fue generado por...."
    })
})

app.listen(port, () => {
  console.log(`servidor a su servicio en el puerto`,port);
});