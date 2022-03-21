const Router = require('express')
const router = new Router()

const walletsRouter = require('./walletsRoutes')

router.use('/wallets', walletsRouter)

module.exports = router
