type Middleware = (
  req: Request,
  res: Response,
  callback: (result: Error | null) => void
) => void;

export default function initMiddleware(middleware: Middleware) {
  return (req: Request, res: Response) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: Error | null) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
} 