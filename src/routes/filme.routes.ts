import { FilmeController } from "../controller/filme.controller.js";
import { Router } from "express";

const router = Router();
const filmeController = new FilmeController();


export {router as filmeRoutes};

router.post('/',filmeController.create);
router.delete('/:id',filmeController.delete);
router.put('/:id', filmeController.update);
router.get('/',filmeController.findAll);
router.get('/:id',filmeController.findById);