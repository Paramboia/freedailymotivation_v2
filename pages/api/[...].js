import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*', // Be more specific in production
    credentials: true,
  })
)

export default async function handler(req, res) {
  // Run cors
  await cors(req, res)

  // Rest of your API logic
}
