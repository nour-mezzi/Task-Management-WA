import { Request, Response } from 'express';

export class TaskHandler {
  static getAll(req: Request, res: Response): void {
    res.status(200).json({ message: 'Get all tasks' });
  }

  static create(req: Request, res: Response): void {
    const { title } = req.body;
    res.status(201).json({ message: `Task "${title}" created` });
  }

  static delete(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(204).json({ message: `Task ${id} deleted` });
  }
}
