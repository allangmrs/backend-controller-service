import type { Request, Response } from "express";
import { FilmeService } from "../services/filme.service.js";

const filmeService = new FilmeService();

type DadosFilme = {
    titulo: string;
    nota: number;
    imagem: string;
};

type ResultadoBody = { dados: DadosFilme } | { erro: string };

function validarId(valor: unknown): number | null {
    if (typeof valor !== "string" && typeof valor !== "number") {
        return null;
    }
    const id = Number(valor);
    if (!Number.isInteger(id) || id <= 0 || id > 2_147_483_647) {
        return null;
    }
    return id;
}

function validarBody(body: unknown): ResultadoBody {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return { erro: "O corpo da requisição deve ser um objeto JSON." };
    }

    const { titulo, nota, imagem } = body as Record<string, unknown>;

    if (typeof titulo !== "string" || titulo.trim() === "") 
        return { erro: "O título deve ser um texto não vazio." };
    
    if (typeof nota !== "number" || !Number.isFinite(nota) || nota < 0 || nota > 10) 
        return { erro: "A nota deve ser um número entre 0 e 10." };
    
    if (typeof imagem !== "string" || imagem.trim() === "") 
        return { erro: "A imagem deve ser um texto não vazio." };
    
    const dados: DadosFilme = {
        titulo: titulo.trim(),
        nota,
        imagem: imagem.trim()
    };
    return { dados };
}

export class FilmeController {
    async create(req: Request, res: Response) 
    {
        const resultado = validarBody(req.body);
        if ("erro" in resultado) {
            res.status(400).json({ erro: resultado.erro });
            return;
        }
        const novoFilme = await filmeService.create(resultado.dados);
        res.status(201).json(novoFilme);
    }

    async delete(req: Request, res: Response) 
    {
        const id = validarId(req.params.id);
        if (id === null) {
            res.status(400).json({ erro: "O ID deve ser um inteiro entre 1 e 2147483647." });
            return;
        }

        const filme = await filmeService.findById(id);
        if (filme === null) {
            res.status(404).json({ erro: "Filme inexistente." });
            return;
        }

        await filmeService.delete(id);
        res.status(204).send();
    }

    async update(req: Request, res: Response) 
    {
        const id = validarId(req.params.id);
        if (id === null) {
            res.status(400).json({ erro: "O ID deve ser um inteiro entre 1 e 2147483647." });
            return;
        }

        const resultado = validarBody(req.body);
        if ("erro" in resultado) {
            res.status(400).json({ erro: resultado.erro });
            return;
        }

        const filme = await filmeService.findById(id);
        if (filme === null) {
            res.status(404).json({ erro: "Filme inexistente." });
            return;
        }

        const filmeAtt = await filmeService.update(id, resultado.dados);
        res.status(200).json(filmeAtt);
    }

    async findAll(req: Request, res: Response) 
    {
        const filmes = await filmeService.findAll();
        res.status(200).json(filmes);
    }

    async findById(req: Request, res: Response) 
    {
        const id = validarId(req.params.id);
        if (id === null) {
            res.status(400).json({ erro: "O ID deve ser um inteiro entre 1 e 2147483647." });
            return;
        }

        const filme = await filmeService.findById(id);
        if (filme === null) {
            res.status(404).json({ erro: "Filme inexistente." });
            return;
        }
        res.status(200).json(filme);
    }
}
