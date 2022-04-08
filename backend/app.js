const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const Sauce = require('./models/sauce');
const productRoutes = require('./routes/sauce');

mongoose.connect('mongodb+srv://go-fullstack:sLGEciCH3UwGUNj6@cluster0.lc0ds.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{useNewUrlParser : true,
useUnifiedTopology: true})
.then(()=> console.log('Connexion à MongoDB réussie !'))
.catch(()=> console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/auth', userRoutes);
app.use('/api/sauces', productRoutes);
app.post('/api/sauces', productRoutes);
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });

module.exports = app;