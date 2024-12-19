import express from 'express';
import { router } from './routes/index'
const app = express();
app.use(express.json())

const PORT = process.env.PORT ?? 3000;

// prefixing routing
app.use('/api/v1', router)

app.listen(PORT, () => {
	console.log(`PORT is running at http://localhost:${PORT}`)
}).on('error', (error) => {
	console.error(error)
})
