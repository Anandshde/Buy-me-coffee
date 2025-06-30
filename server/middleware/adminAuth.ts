import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    if ((decoded as any).role !== 'admin' && !(decoded as any).isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
