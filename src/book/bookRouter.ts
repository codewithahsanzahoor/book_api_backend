import express from "express";
const bookRouter = express.Router();

bookRouter.get("/", createBook);

export default bookRouter;
