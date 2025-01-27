//importo cors para loggear las request HTTP
import cors from 'cors';
//importo express para levantar el server HTTP
import express from 'express';
//importo la funcion readdirSync fs para cargar las routes
import { readdirSync } from 'fs';
//importo mongoose para conectar mi app a mongodb
import mongoose from 'mongoose';
//importo morgan
const morgan = require('morgan');
//importo dotenv para cargar las variables de entorno
require('dotenv').config();

//creo una app express (un server)
const app = express();

//conecto db
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('***DB CONNECTED***'))
	.catch((error) => console.log(`***DB CONNECTION ERROR => ${error}***`));

//aplico middlewares utilizando app.use
app.use(cors());
//express.json() /étodo incorporado en express para reconocer el objeto de solicitud entrante como un objeto JSON. Este metodo se llama, middleware
app.use(express.json());
//método incorporado en express para reconocer el objeto de solicitud entrante como cadenas o matrices
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//mapeo todas mis rutas, leo el archivo routes y por cada ruta que exporto hago un app.use

readdirSync('./routes').map((route) => {
	app.use('/api', require(`./routes/${route}`));
});
//port

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`***SERVER IS RUNNING ON PORT ${PORT}***`);
});
