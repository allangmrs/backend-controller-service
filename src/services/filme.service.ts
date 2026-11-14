import { prisma } from "../prisma/client.js";

export class FilmeService{

    async create(dados: {titulo: string; nota: number; imagem: string; })
    {

    }

    async delete(id: number)
    {

    }

    async findAll()
    {
        const filmes = await prisma.filme.findMany();

        return filmes;
    }

    async findById(id: number)
    {
        const filme = await prisma.filme.findUnique({
            where: {
                id: id
            }
        });

        return filme;
    }

    async update(id:number, dados: {titulo: string; nota: number; imagem: string; })
    {

    }

}