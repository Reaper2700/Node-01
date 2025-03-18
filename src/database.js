import fs from "node:fs/promises"

const databasePath = new URL('../db.json',import.meta.url)

export class Database{
    #database = {}

    constructor(){
        this.loadDatabase();
    }

    async loadDatabase(){
        try{
            const data = await fs.readFile(databasePath, "utf8");
            this.#database = JSON.parse(data)
        }catch (error) {
            console.error("Erro ao carregar o banco de dados:", error);
            this.#persist();
        }
    }

    async #persist(){
        try{
            await fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
        } catch (err) {
            console.error("Erro ao salvar o arquivo:", err);
        }
    }
    
    getById(table, id) {
        return this.#database[table].find(row => row.id === id) || null;
    }

    select(table, search){
        let data = this.#database[table] ?? [];
        
        if(search){
            data = data.filter(row =>{
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else{
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if(rowIndex > -1){
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                ...data,
            };
            this.#persist();
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id == id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        } 

    }
}