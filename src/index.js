const axios = require("axios");
const fetch = require("node-fetch");
const { ApolloServer, gql } = require("apollo-server");
const { METHODS } = require("http");
const url1 = "http://localhost:5000/";


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

  type Mutation {
    updatesolicitud(
      id_solicitud: ID
      estado: String
    ): Solicitud
    postsolicitud(
      id_funcionario: Int
      justificacion: String
      tiempo_e: String            
    ): Solicitud
    postelement(
      nombre: String
      cantidad: Int
      id_solicitud: Int        
    ): Elemento
  }
`;




const resolvers = {
    Query: {
      finduser: (root, args) => fetchUser(args),
      solicitudes: () => fetchSolicitudes(),
      findsolicitud: (root, args) => fetchSolicitud(args),
      findelementos: (root, args) => fetchElementos(args),
    },
    Mutation: {
      updatesolicitud: (root, args) => updateSoli(args),
      postsolicitud: (root, args) => postSoli(args),
      postelement: (root, args) => postElement(args),
    }
  };



const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

function fetchUser(args) {
  let {email, contrasena} = args;
  let link = url1 + "cuenta/" + email + "/" + contrasena;
  return fetch(link)
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
    let link = url1 + "solicitudes";
  return fetch(link)
    .then(res => res.json())
    .then(json => {
      let solicitudes = json;      
      //console.log(json);
      return solicitudes;
    });
}

function fetchSolicitud(args) {  
  let {id_solicitud} = args;
  let link = url1 + "solicitud/" + id_solicitud ;
return fetch(link)
  .then(res => res.json())
  .then(json => {
    let solicitud = json[0];      
    //console.log(json);
    return solicitud;
  });
}

function fetchElementos(args) {  
  let {id_solicitud} = args;
  let link = url1 + "elemento/" + id_solicitud ;
return fetch(link)
  .then(res => res.json())
  .then(json => {
    let elementos = json;      
    //console.log(json);
    return elementos;
  });
}

function updateSoli(args) {  
  let {id_solicitud, estado} = args;
  let link = url1 + "updatesolicitud/" + id_solicitud + "/" + estado ;
  console.log(link);
return fetch(link, {
  method: 'PUT'
})
  .then(res => res.json())
  .then(json => {
    let elementos = json;      
    
    return elementos;
  });
}
function postSoli(args) {  
  let {id_funcionario, justificacion, tiempo_e} = args;
  let link = url1 + "postsolicitud";
  let body1 = {    
      "id_funcionario": id_funcionario,
      "justificacion": justificacion,
      "tiempo_e": tiempo_e,
      "estado": "Diligenciada"
  }
  return axios.post(link, body1).then(function(res) {    
    console.log(res.data[0]);
    return res.data[0];
  });  
}

function postElement(args) {  
  let {nombre, cantidad, id_solicitud} = args;
  let link = url1 + "postelement";
  let body1 = {
    "nombre": nombre,
    "cantidad": cantidad,
    "id_solicitud": id_solicitud
  }
  return axios.post(link, body1).then(function(res) {    
    console.log(res.data[0]);
    return res.data[0];
  });  
}