import { Router } from "express";
import progressivePage from "./routes/index/index";

export const router = Router().get("/", progressivePage);
