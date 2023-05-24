var express = require('express');
const { graphqlHTTP } = require('express-graphql'); 
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Alumno {
        id:Int
        nombre: String
        calificacion: Int
    }

    type Query{
        alumnos:[Alumno]
        alumno(id:Int):Alumno
    }

    type Mutation{
        addAlumno(nombre: String,calificacion:Int):Alumno
        updateAlumno(id: Int, nombre: String,calificacion:Int):Alumno
        deleteAlumno(id: Int):Alumno
    }

`);

var alumnos = [];
var contador = 1;

var root = {
    alumnos: () => { return alumnos; },
    alumno: (data) => {
        for (var i = 0; i < alumnos.length; i++) {
            if (alumnos[i].id == data.id) {
                return alumnos[i];
            }
        }
        return null;
    },
    addAlumno: (data) => {
        var a = { 'id': contador, 'nombre': data.nombre, 'calificacion': data.calificacion };
        alumnos.push(a);
        contador++;
        return a;
    },
    updateAlumno: (data) => {
        for (var i = 0; i < alumnos.length; i++) {
            if (alumnos[i].id == data.id) {
                alumnos[i].nombre=data.nombre;
                alumnos[i].calificacion=data.calificacion;
                return alumnos[i];
            }
        }
    },
    deleteAlumno: (data) => {
        alumnos.splice(data.id-1,1);
        return "Borrado"
    },
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000);
console.log('Server at http://localhost:4000/graphql');
