import { setupServer } from 'msw/node'
import { restHandlers, graphqlHandlers } from './handlers'

// Crear servidor MSW para tests (Node.js environment)
export const server = setupServer(...restHandlers, ...graphqlHandlers)
