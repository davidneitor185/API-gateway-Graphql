const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");


const typeDefs = gql`
 
   type User {
    id_cuenta: ID
    id_funcionario: Int
    id_rol: Int
    contrasena: String
    acceso: String
    jefe_inmediato: Int
    nombre_funcionario: String
    email: String
    depto_funcionario: String
    identificacion: String
    tel: String
  }

  type Solicitud {
    id_funcionario: Int
    id_solicitud: ID
    justificacion: String
    tiempo_e: String
    estado: String
    jefe_inmediato: Int
    nombre_funcionario: String
    email: String
    depto_funcionario: String
    identificacion: String
    tel: String
  }

  type Elemento {
    id_elemento: ID
    nombre: String
    cantidad: Int
    id_solicitud: Int
  }
  
  type Query {
    finduser(email: String, contrasena: String): User
    solicitudes: [Solicitud] 
    findsolicitud(id_solicitud: Int): Solicitud 
    findelementos(id_solicitud: Int): [Elemento]
  }
`;




const resolvers = {
    Query: {
      finduser: (root, args) => fetchUser(args),
      solicitudes: () => fetchSolicitudes(),
      findsolicitud: (root, args) => fetchSolicitud(args),
      findelementos: (root, args) => fetchElementos(args),
    },
  };



const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

function fetchUser(args) {
  let {email, contrasena} = args;
  let url = "http://localhost:5000/cuenta/" + email + "/" + contrasena;
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      let user= json;
      const userFormat ={
        id_funcionario: user[0].id_funcionario,
        id_cuenta: user[0].id_cuenta,
        id_rol: user[0].id_rol,
        contrasena: user[0].contraseña,
        acceso: user[0].acceso,
        jefe_inmediato: user[0].jefe_inmediato,
        nombre_funcionario: user[0].nombre_funcionario,
        email: user[0].email,
        depto_funcionario: user[0].depto_funcionario,
        identificacion: user[0].identificacion,
        tel: user[0].tel
      }
      //console.log(userFormat)
      return userFormat
    });
}

function fetchSolicitudes() {  
    let url = "http://localhost:5000/solicitudes";
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      let solicitudes = json;      
      //console.log(json);
      return solicitudes;
    });
}

function fetchSolicitud(args) {  
  let {id_solicitud} = args;
  let url = "http://localhost:5000/solicitud/" + id_solicitud ;
return fetch(url)
  .then(res => res.json())
  .then(json => {
    let solicitud = json[0];      
    //console.log(json);
    return solicitud;
  });
}

function fetchElementos(args) {  
  let {id_solicitud} = args;
  let url = "http://localhost:5000/elemento/" + id_solicitud ;
return fetch(url)
  .then(res => res.json())
  .then(json => {
    let elementos = json;      
    console.log(json);
    return elementos;
  });
}