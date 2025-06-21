const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Временное хранилище данных
const users = [];
const products = [
    { id: 1, name: 'Товар 1', description: 'Описание товара 1', price: 10, image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Товар 2', description: 'Описание товара 2', price: 20, image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Товар 3', description: 'Описание товара 3', price: 30, image: 'https://via.placeholder.com/200' },
];
const orders = [];

// Middleware
app.use(bodyParser.json()); // Для обработки JSON в запросах
app.use(cors()); // Разрешение запросов с других источников (например, localhost)

// Статический контент (для фронтенда)
app.use(express.static(__dirname)); // Позволяет серверу отдавать файлы (например, index.html)

// Маршрут для получения списка товаров
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Маршрут для регистрации
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }

    // Проверяем, есть ли пользователь с таким email
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже зарегистрирован' });
    }

    // Регистрация нового пользователя
    users.push({ username, email, password });
    res.json({ message: 'Регистрация успешна!' });
});

// Маршрут для покупки товара
app.post('/api/buy', (req, res) => {
    const { productId, userEmail } = req.body;

    // Проверка наличия пользователя
    const user = users.find(user => user.email === userEmail);
    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден. Пожалуйста, зарегистрируйтесь.' });
    }

    // Проверка наличия товара
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    // Добавление заказа
    orders.push({ userEmail, product });
    res.json({ message: `Покупка товара "${product.name}" успешно оформлена!` });
});

// Маршрут для получения списка заказов пользователя
app.get('/api/orders', (req, res) => {
    const { userEmail } = req.query;

    // Проверяем, передан ли email
    if (!userEmail) {
        return res.status(400).json({ message: 'Email пользователя обязателен' });
    }

    // Проверка наличия пользователя
    const user = users.find(user => user.email === userEmail);
    if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
    }

    // Поиск заказов пользователя
    const userOrders = orders.filter(order => order.userEmail === userEmail);
    res.json(userOrders);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});