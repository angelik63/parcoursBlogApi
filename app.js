const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');


app.use(express.json());

// Fonctions utilitaires pour lire/écrire des fichiers JSON à placer ici


const readJson = (path) => {
  const raw = fs.readFileSync(path, 'utf-8');
  return JSON.parse(raw);
};

const writeJson = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const afficherFichier = (path) => {
  const contenu = readJson(path);
  console.log(contenu);
};

afficherFichier('data/posts.json');


// Test de démarrage
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API du mini-blog !');
});

// Routes à compléter ici


app.get('/posts' , (req, res) => {
  const posts = readJson('./data/posts.json');
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const postId = parseInt (req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    res.status(404).send('Post non trouvé')
  }
  res.json(posts[postId-1])
});

const mypath = path.join(__dirname, 'data', 'posts.json');
let posts = readJson(mypath);
app.post('/posts', (req, res) => {
  const nouveauPost = req.body;
  posts.push(nouveauPost);

  try {
    writeJson(mypath,posts);
    res.status(201).send('Nouveau post créé');
  }catch (err) {
    res.status(500).send("Erreur d'enregistrement");
  }
});


app.patch('posts/:id',(req, res) => {
  const postId = parseInt(req.params.id);
  const { title } = req.body;
  const index = postId-1
  posts[index].title = title;
  writeJson(dataPath, JSON.stringify(posts),(err) => {
    if (err) {
      console.error("Erreur lors de la modification :" );
      return res.status(500).json({message: "Erreur serveur"});
    }
    res.json({message: "Post mis à jour", post: posts[index]});
  });
});


app.delete('/posts/:id', (req,res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex((p) => p.id === postId);
  posts.splice(index,1);
  try {
    writeJson(mypath, posts);
    res.status(201).send('post supprimé')
  } catch (err) {
    res.status(204)._construct('erreur');
  }
});


const compath = path.join(__dirname, 'data', 'comments.json');
let comments = readJson(compath);

app.get('/comments/:id/comments' , (req, res) => {
  const postID = readJson('./data/comments.json');
  res.json(comments);
});

app.get('/comments/:id', (req, res) => {
  const comId = parseInt (req.params.id);
  const com = comments.find((c) => c.id === comId);

  if (!com) {
    res.status(404).send('commentaire non trouvé')
  }
  res.json(comments[comId-1])
});

app.post('/posts/:id/comments', (req, res) => {
  const nouveauCom = req.body;
  comments.push(nouveauCom);

  try {
    writeJson('./data/comments.json', comments);
    res.status(201).send('Nouveau com créé');
  }catch (err) {
    res.status(500).send("Erreur d'enregistrement");
  }
});

app.delete('/posts/:id', (req,res) => {
  const comId = parseInt(req.params.id);
  const index = comments.findIndex((c) => c.id === comId);
  comments.splice(index,1);
  try {
    writeJson('./data/comments.json', comments);
    res.status(201).send('commentaire supprimé')
  } catch (err) {
    res.status(204).send('erreur');
  }
});


// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
