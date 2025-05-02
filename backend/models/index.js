/*
'use strict';

import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import configFile from '../config/config.js';
import { pathToFileURL } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Cargar modelos dinámicamente con rutas válidas en Windows
readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== _basename(__filename) &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(async (file) => {
    const fileUrl = pathToFileURL(resolve(__dirname, file));
    const modelModule = await import(fileUrl.href);
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

*/

'use strict';

import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import configFile from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];
const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Cargar modelos dinámicamente asegurando que **esperamos** a que todos se importen antes de continuar
const modelFiles = readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' && file.endsWith('.js'));

await Promise.all(
  modelFiles.map(async (file) => {
    const fileUrl = pathToFileURL(resolve(__dirname, file));
    const modelModule = await import(fileUrl.href);
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  })
);

// Configurar asociaciones después de que los modelos sean cargados
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
