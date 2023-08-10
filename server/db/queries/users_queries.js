import getPool from '../pool.js'

async function getUserBy (obj) {
  const queryStr = Object.entries(obj).map(arr => `${arr[0]} = '${arr[1]}'`).join(', ')
  let connection

  try {
    connection = await getPool()

    const [user] = await connection.query(
      `SELECT * FROM users WHERE ${queryStr}`
    )
    return user[0]
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function newUser ({ email, username, password, registrationCode }) {
  let connection

  try {
    connection = await getPool()

    // Busco un usuario con el email que me ha entregado el usuario
    let user = await getUserBy({ email })
    if (user) throw new Error('Ya existe un usuario con ese email')

    // Busco el usuario con el username entregado
    user = await getUserBy({ username })
    if (user) throw new Error('Nombre de usuario no disponible')

    // Hago la inserción del usuario en la db
    const result = await connection.query(
      'INSERT INTO users (email, username, password, registrationCode, createdAt) VALUES(?, ?, ?, ?, ?)',
      [email, username, password, registrationCode, new Date()]
    )

    const savedId = result[0].insertId
    console.log(result)
    return result[0]
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

export {
  getUserBy,
  newUser
}
