import { useState, useEffect } from 'react'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import Tonweb from 'tonweb'

const tonweb = new Tonweb(new Tonweb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'))

const ADMIN_TELEGRAM_ID = 1875459781 // ← Замени на свой Telegram ID
const YOUR_TON_WALLET_ADDRESS = 'UQBGdlPYwp0DjQCkGhIr3S3wfqUAw50i9XgBifWNQTzCpBNG' // ← Замени на свой Tonkeeper адрес
const BOT_USERNAME = 'dark_crypt0bot' // ← Замени на имя бота без @

const mockProducts = [
  { id: 1, name: 'Gift #1', price: 1.5, image: 'https://via.placeholder.com/300?text=Gift1', description: 'Крутой цифровой подарок' },
  { id: 2, name: 'Gift #2', price: 3, image: 'https://via.placeholder.com/300?text=Gift2', description: 'Редкий item' },
]

function App() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState(mockProducts)
  const [isAdmin, setIsAdmin] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '' })

  const [tonConnectUI] = useTonConnectUI()
  const address = useTonAddress()
  const [balance, setBalance] = useState(null)

  // Telegram Login
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', BOT_USERNAME)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true
    document.getElementById('telegram-login').appendChild(script)

    window.onTelegramAuth = (user) => {
      setUser(user)
      setIsAdmin(user.id === ADMIN_TELEGRAM_ID)
    }
  }, [])

  // Баланс
  useEffect(() => {
    if (address) {
      tonweb.getBalance(address).then(b => setBalance(Tonweb.utils.fromNano(b)))
    }
  }, [address])

  const buyProduct = async (product) => {
    if (!address) return alert('Подключи кошелёк')
    if (!tonConnectUI.connected) return alert('Кошелёк не подключён')

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [{
        address: YOUR_TON_WALLET_ADDRESS,
        amount: Tonweb.utils.toNano(product.price.toString()),
        payload: `Order: ${product.id} from ${user?.username || user?.id}`
      }]
    }

    try {
      await tonConnectUI.sendTransaction(transaction)
      alert('Оплата отправлена! Скоро доставим.')
    } catch (e) {
      alert('Ошибка оплаты')
    }
  }

  const addProduct = () => {
    setProducts([...products, { 
      id: Date.now(), 
      ...newProduct, 
      price: parseFloat(newProduct.price) 
    }])
    setNewProduct({ name: '', price: '', image: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Portal Market</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {address && <span>Баланс: {balance ? `${balance} TON` : '...'}</span>}
          <button onClick={() => tonConnectUI.connectWallet()} className="bg-blue-600 px-6 py-3 rounded-lg">
            {address ? 'Подключён' : 'Tonkeeper'}
          </button>
          <div id="telegram-login" />
        </div>
      </header>

      {user && <p className="text-center my-6 text-xl">Привет, {user.first_name}!</p>}

      {isAdmin && (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg my-8">
          <h2 className="text-2xl mb-6">Админка — новый товар</h2>
          <input placeholder="Название" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="block w-full mb-3 p-3 bg-gray-700 rounded" />
          <input placeholder="Цена в TON" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="block w-full mb-3 p-3 bg-gray-700 rounded" />
          <input placeholder="URL изображения" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="block w-full mb-3 p-3 bg-gray-700 rounded" />
          <input placeholder="Описание" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="block w-full mb-4 p-3 bg-gray-700 rounded" />
          <button onClick={addProduct} className="w-full bg-green-600 py-3 rounded-lg font-bold">Добавить товар</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 max-w-6xl mx-auto">
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <p className="text-3xl font-bold mb-6">{product.price} TON</p>
              <button onClick={() => buyProduct(product)} className="w-full bg-blue-600 py-4 rounded-lg font-bold text-lg">
                Купить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App