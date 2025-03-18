import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route.js"
import { Database } from "./database.js";
import path from "node:path";



const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req,res) => {
            const { title, description} = req.body;

            if(!title || !description){
                return res.writeHead(400).end(JSON.stringify({error: "Title and description are required."}))
            }

            const timestamp = new Date().toISOString()

            const task ={
                id:randomUUID(),
                title,
                description,
                created_at: timestamp,
                updated_at: timestamp,
                completed_at: null
            }
            
            database.insert('tasks', task)
            
            return res.writeHead(201).end(JSON.stringify({message: "Criação de usuario", task}))
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const tasks = database.select('tasks')

            return res.writeHead(200, { "Content-Type": "application/json" })
                .end(JSON.stringify(tasks));
        }
    },
    {   
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) => {
            const { id } = req.params
            const { title, description} = req.body

            if( title && description){
                return res.writeHead(400).end("Você só pode atualizar title ou description, não ambos." );
            }
            
            const updateField = {}
            if(title) updateField.title = title
            if(description) updateField.description = description
            updateField.updated_at = new Date().toISOString();


            database.update('tasks', id, updateField)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) =>{
            const { id } = req.params

            const task = database.getById('tasks', id);
            if(!task){
                return res.writeHead(404).end('task não encontrada');
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {   method: 'PATCH',
        path: buildRoutePath('/tasks/:id'),
        handler: (req,res) =>{
            const { id } = req.params
            
            database.update('tasks', id, {completed_at: new Date().toISOString()})

            return res.writeHead(204).end()
        }
    }
]