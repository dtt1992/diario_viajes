import crypto from 'node:crypto'
import encryptPassword from '../helpers/encrypt_password.js'
import { newUser } from '../db/queries/users_queries.js'

async function createUser (req, res, next) {
  const { email, username, password } = req.body

  if (!email) throw new Error('El campo email es obligatorio')
  if (!username) throw new Error('El campo username es obligatorio')
  if (!password) throw new Error('El campo password es obligatorio')

  // Generamos un código de registro
  const registrationCode = crypto.randomUUID()

  // Encriptamos la contraseña
  const hashedPass = await encryptPassword({ password })

  // Crear el usuario
  const user = await newUser({ email, username, password: hashedPass, registrationCode })

  if (user instanceof Error) throw user

  res.json({ user })
}

export default {
  createUser
}
