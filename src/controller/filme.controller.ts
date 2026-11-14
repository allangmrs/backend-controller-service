import { Request, Response } from "express";
import { FilmeService } from "../services/filme.service.js";

const filmeService = new FilmeService();

export class FilmeController{

    async create(req: Request, res: Response) 
    {
        const { titulo, nota, imagem } = req.body;

        if (typeof titulo !== 'string' || titulo.trim() === '') {
            res.status(400).send();
            return;
        }

        if (typeof nota !== 'number' || Number.isNaN(nota) || nota < 0 || nota > 10) {
            res.status(400).send();
            return;
        }

        if (typeof imagem !== 'string' || imagem.trim() === '') {
            res.status(400).send();
            return;
        }

        const novoFilme = await filmeService.create({
            titulo: titulo.trim(),
            nota,
            imagem: imagem.trim()
        });

        res.status(201).json(novoFilme);
}


    async delete(req: Request, res: Response)
    {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 0){
            res.status(400).send(); // id invalido
            return;
        }
        await filmeService.delete(id);
        res.status(204).send();
    }

    async update(req:Request, res:Response)
    {
        const data = req.body;
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 0){
            res.status(400).send(); // id invalido
            return;
        }
        const filmeAtt = await filmeService.update(id, data);
        res.status(200).json(filmeAtt);

    }

    async findAll(req:Request, res:Response)
    {
        const filmes = await filmeService.findAll();
        res.status(200).json(filmes);
    }

    async findById(req:Request, res:Response)
    {
        const idBuscado = Number(req.params.id);
        if (!Number.isInteger(idBuscado) || idBuscado < 0){
            res.status(400).send(); // id invalido
            return;
        }
        const filme = await filmeService.findById(idBuscado);
        if (filme == null){
            res.status(404).json({inexiste:"Filme Inexistente"});
            return;
        }
        res.status(200).json(filme);
    }

}