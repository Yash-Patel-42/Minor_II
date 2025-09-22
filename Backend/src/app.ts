import express from "express";
const app = express();

app.get("/",(req, res)=>{
    res.json({message: "Welcome to Minor-II"})
})

export default app;
