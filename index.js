const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

// midel wire 
app.use(cors())
app.use(express.json())



// todo_admin   uxh3p5Hfjwf6yuB5

// database    name ;   todoDb   collentions :  todos





const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.j5xvo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const todosCollection = client.db("todoDb").collection("todos");
        const completeTodosCollection = client.db("todoDb").collection("completeTodos");




        console.log('db is runing');

        // todo post method

        app.post('/todos', async (req, res) => {
            const todo = req.body;
            await todosCollection.insertOne(todo);
            res.send({ success: true, message: `SuccesFully Added ${todo.todoName}` })
        })



        // Complete todo post method

        app.post('/completeTodos', async (req, res) => {
            const completeTodo = req.body;
            await completeTodosCollection.insertOne(completeTodo);
            res.send({ success: true, message: `SuccesFully Complete ${completeTodo.todoName}` })
        })


        // Get todo 
        app.get('/alltodo', async (req, res) => {
            const todos = await todosCollection.find().toArray()
            res.send({ success: true, data: todos });
        })



        // Get complete todo
        app.get('/completeTodos', async (req, res) => {
            const todos = todosCollection.find({ check: true })
            console.log(todos);
            const result = await todos.toArray();
            console.log('result', result);
            res.send({ success: true, data: result });
        })

        // update ToDo
        app.put('/upToDo/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    todoName: data.toDo
                },
            };
            const Todo = await todosCollection.updateOne(filter, updateDoc, options);
            res.send({ success: true, data: Todo });
        })




        // update complete ToDo
        app.put('/completeTodo/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: data
            };
            const completeTodo = await todosCollection.updateOne(filter, updateDoc, options);
            console.log(completeTodo);
            res.send({ success: true, data: completeTodo });
        })



        app.delete('/daleteTodo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await todosCollection.deleteOne(query);
            res.send({ success: true, data: product });
        })







    } catch (error) {
        console.log(error);
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('backend is fire')
})

app.listen(port, () => {
    console.log('app is listing Port: ', port);
})
