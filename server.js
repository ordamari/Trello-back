const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')


const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Express App Config
app.use(cookieParser())
app.use(bodyParser.json());
app.use(session({
    secret: 'something-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: /http:\/\/localhost:\d+/,
        credentials: true
    };
    app.use(cors(corsOptions));
}

// ROUTES 
const authRoutes = require('./api/auth/auth.routes.js')
const userRoutes = require('./api/user/user.routes')
const boardRoutes = require('./api/board/board.routes')
const connectSockets = require('./api/socket/socket.routes')


// REST API  :)
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/board', boardRoutes)
connectSockets(io)


app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
const logger = require('./services/logger.service')
const port = process.env.PORT || 3030;

http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
});

