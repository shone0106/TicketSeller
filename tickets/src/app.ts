import express from 'express'
import { json } from 'body-parser'
import createHttpError from "http-errors"
import cookieSession from "cookie-session"


const app = express()
app.set('trust proxy', true)
app.use(json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.get('/api/tickets/home', (req, res)=>{
  res.send('hi from ticket service')
})

app.use((req, res, next)=>{
    throw createHttpError(404, 'endpoint not found')
})


export { app }