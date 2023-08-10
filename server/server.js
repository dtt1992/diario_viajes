import express from 'express'

// Configuracion
import { PORT } from './config.js'

const app = express()

// Middlewares
app.use(morgan("common"))

app.listen(PORT, () => {
  console.log(`El servidor esta operativo en http://localhosto:${PORT}
  Press Ctrl-C to terminate.`)
})
