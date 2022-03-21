const Router = require('express')
const router = new Router()
const walletsController = require('../controllers/walletsController')

router.get('/', walletsController.getAllBalances)
router.get('/refreshBalances', walletsController.refreshBalances)
router.post('/updateBalance', walletsController.updateBalance)
router.post('/receiveTokens', walletsController.receiveTokens)

module.exports = router
