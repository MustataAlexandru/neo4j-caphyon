const express = require('express');
const neo4j = require('neo4j-driver');
const app = express();
const port = 3003;
const cors = require('cors');
const bodyParser = require('body-parser')
const uri = "neo4j://34.232.57.230:7687";
const username = "neo4j";
const password = "internship-2024";
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})


app.get('/authors', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run("MATCH (n:Author) RETURN n LIMIT 20");
        const authors = result.records.map(record => record.get('n').properties);
        res.json(authors);
    } catch (error) {
        console.error('Error querying Neo4j:', error);
        res.status(500).send('Internal server error');
    } finally {
        await session.close();
    }
});

app.get('/ingredients', async (req , res) => {
    const session = driver.session();
    try {
        const result = await session.run("MATCH (n:Ingredient) RETURN n LIMIT 20");
        const ingredients = result.records.map(record => record.get('n').properties);
        res.json(ingredients);
    } catch (error) {
        console.error('Error querying neo4j:' , error);
        res.status(500).send('Internal server error')
    } finally {
        await session.close();
    }
})

app.get('/recipes', async (req, res) => {
    const session = driver.session();
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;  
        const skip = (page - 1) * limit;  

        console.log(limit);
        const countResult = await session.run("MATCH (r:Recipe) RETURN count(r) AS total");
        const total = countResult.records[0].get('total').toNumber();

        // PAGINATED RECIPES
        const result = await session.run(
            ////// POSSIBLE BUG //////////
            /////// LIMIT AND SKIP SHOULD HAVE NEVER BEEN FLOATS!!!
            "MATCH (r:Recipe) RETURN r SKIP TOINTEGER($skip) LIMIT TOINTEGER($limit)",
            { skip: skip, limit: limit } 
        );
           console.log(limit)
        const recipes = result.records.map(record => record.get('r').properties);
        res.json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            recipes
        });
    } catch (error) {
        console.error('Error querying Neo4j:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
});






app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});