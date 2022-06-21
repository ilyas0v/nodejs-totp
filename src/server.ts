import * as express from 'express'  
import { login } from './controllers/login'
import { register } from './controllers/register'

const app = express()
app.use(express.json())

app.use('/', express.static('frontend'))

app.post('/api/register', register)
app.post('/api/login', login)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Development server started on ' + PORT)
})
