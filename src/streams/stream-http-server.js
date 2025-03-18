import fs from 'fs';
import { parse } from 'csv-parse';


const FILE_PATH = './src/streams/tasks.csv'; // Caminho do CSV
const API_URL = 'http://localhost:3350/tasks'; // Altere para o endereço da sua API

async function importCSV() {
    const stream = fs.createReadStream(FILE_PATH);
    const parser = parse({ columns: true, trim: true });

    stream.pipe(parser);

    for await (const record of parser) {
        const { title, description } = record;

        // Envia cada linha como JSON para a API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });

        if (response.ok) {
            console.log(`✅ Task criada: ${title}`);
        } else {
            console.error(`❌ Erro ao criar task: ${title}`);
        }
    }

    console.log('📂 Importação concluída!');
}

importCSV().catch(console.error);
