import { Router } from "express";
import searchPage from "./routes/index/index";

export const router = Router().get("/", searchPage);
