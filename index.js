const express = require("express");

//Inicia o servidor
const server = express();

//Aqui informo ao express o uso do json
server.use(express.json());

/*A variável let foi usada porque sofrerá mutação, a variavel const é um array e pode receber adições
ou exclusoes */
let numberOfRequests = 0;
const projects = [];

/*Middleware que que verifica se o projeto existe*/
function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const { project } = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ Error: "Projetc not found " });
  }

  return next();
}

//Middleware global que imprime a quantidade de requisições
function logRequest(req, res, next) {
  numberOfRequests++;

  Console.log(`Número de requisições:${numberOfRequests}`);
  return next();
}
server.use(logRequest);

//lista todos projetos e tarefas;
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Cadastra um novo título
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    task: []
  };

  projects.push(project);

  return res.json(project);
});

//Altera o título do projeto
server.put("projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Deletando o projeto
server.delete("projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projects, 1);

  return res.send();
});

/**Tasks */

server.post("/projects/:id/tasks", checkProjectExist, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
