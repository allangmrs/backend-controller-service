import { prisma } from "../prisma/client.js";

export class FilmeService{

    async create(dados: {titulo: string; nota: number; imagem: string; })
    {
        const filme = await prisma.filme.create({
            data: {
                titulo: dados.titulo,
                nota: dados.nota,
                imagem: dados.imagem
            }
        });

        return filme;
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
        const filme = await prisma.filme.update({
            where: {
                id: id
            },
            data: dados
            
        });

        return filme;
    }

}