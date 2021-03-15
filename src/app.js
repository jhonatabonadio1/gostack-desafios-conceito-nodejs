const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

const app = express();

function isValidId(req, res, next){
  const { id } = req.params;

  if(!isUuid(id)){
    return res.status(400).json({error: "Invalid repository ID."})
  }

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0
    }

    repositories.push(repository);

    return res.json(repository)
});

app.put("/repositories/:id", isValidId, (req, res) => {
  const { id } = req.params
    const { title, url, techs } = req.body

    const findRepo = repositories.findIndex(repo => repo.id === id)

    if(findRepo < 0) {
        return res.status(400).json({error: "Repository does not exists."})
    }

    const repository = {
        id,
        title,
        url,
        techs,
        likes: repositories[findRepo].likes
    }

    repositories[findRepo] = repository

    return res.json(repository)
});

app.delete("/repositories/:id", isValidId, (req, res) => {
  const { id } = req.params

  const findRepo = repositories.findIndex(repo => repo.id === id)

  if(findRepo < 0) {
      return res.status(400).json({error: "Repository does not exists"})
  }

  repositories.splice(findRepo, 1)

  return res.status(204).send();
});

app.post("/repositories/:id/like", isValidId, (req, res) => {
  const { id } = req.params

    const findRepo = repositories.findIndex(repo => repo.id === id)

    if(findRepo < 0) {
        return res.status(400).json({error: "Repository does not exists"})
    }

    repositories[findRepo].likes += 1

    const repository = repositories[findRepo]

    return res.json(repository)
});

module.exports = app;
