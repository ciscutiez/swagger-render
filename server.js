const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
let items = [{ id: 1, name: 'item1', price: 100 }];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/items', (req, res) => {
  res.json(items);
});
app.post('/items', (req, res) => {
  const item = {
    id: items.length + 1,
    name: req.body.name,
    price: req.body.price,
  };

  items.push(item);
  app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find((i) => i.id === id);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    item.name = req.body.name;
    item.price = req.body.price;
    res.send(item);
  });

  app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      return res.status(404).send('Item not found');
    }
    items.splice(index, 1);
    res.status(204).send();
  });
  res.status(201).send(item);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
