import express from 'express';
const app = express();

app.use(express.json());
app.post('/user', (req: express.Request, res: express.Response) => {

});