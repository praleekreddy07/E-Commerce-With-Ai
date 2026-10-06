import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownWideNarrow, ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, CircleHelp, Copy, Heart, Menu, MessageCircle, Minus, Package, Plus, Search, Send, ShieldCheck, ShoppingBag, Sparkles, Star, TicketPercent, Truck, X } from 'lucide-react'
import './App.css'

const curatedProducts = [
  { id: 'preview-headphones', name: 'QuietForm wireless headphones', category: 'Audio', price: 4999, ratingAverage: 4.8, reviewCount: 284, stockQuantity: 14, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85', modelIdentifier: 'QF-02', description: 'Deep focus, softer edges. Adaptive noise cancelling with a 36-hour battery and a fit you can forget about.', badge: 'Staff pick' },
  { id: 'preview-speaker', name: 'Pebble portable speaker', category: 'Audio', price: 3290, ratingAverage: 4.7, reviewCount: 192, stockQuantity: 22, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=85', modelIdentifier: 'PB-01', description: 'Small footprint, expansive sound. A water-resistant everyday speaker with a warm, balanced profile.', badge: 'Good sound, less spend' },
  { id: 'preview-camera', name: 'Pocket 35 film camera', category: 'Photography', price: 6790, ratingAverage: 4.6, reviewCount: 86, stockQuantity: 8, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85', modelIdentifier: 'P35-01', description: 'A pocket-sized point-and-shoot for the photos you want to remember, not just store.', badge: 'Limited batch' },
  { id: 'preview-lamp', name: 'Morrow sculptural table lamp', category: 'Home', price: 4590, ratingAverage: 4.9, reviewCount: 143, stockQuantity: 11, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85', modelIdentifier: 'MR-L1', description: 'A quiet little pool of light for late reading, early mornings, and the in-between.', badge: 'Small-space favorite' },
  { id: 'preview-watch', name: 'Field Notes everyday watch', category: 'Accessories', price: 5890, ratingAverage: 4.5, reviewCount: 217, stockQuantity: 17, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85', modelIdentifier: 'FN-36', description: 'A reliable, considered timepiece with a clean dial and a comfortable recycled strap.', badge: 'Everyday essential' },
  { id: 'preview-chair', name: 'Curve low lounge chair', category: 'Home', price: 12490, ratingAverage: 4.8, reviewCount: 62, stockQuantity: 5, imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=85', modelIdentifier: 'CV-LC', description: 'Sculptural lines and generous comfort, made for slow Sundays and long conversations.', badge: 'Design award' },
  { id: 'preview-earbuds', name: 'Daylight wireless earbuds', category: 'Audio', price: 2790, ratingAverage: 4.6, reviewCount: 318, stockQuantity: 26, imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85', description: 'Easy listening, clear calls, and a pocket-sized charging case.', badge: 'Everyday audio' },
  { id: 'preview-turntable', name: 'Sunday record player', category: 'Audio', price: 8490, ratingAverage: 4.7, reviewCount: 104, stockQuantity: 9, imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=1000&q=85', description: 'A simple belt-drive turntable made for bringing old favorites back into rotation.', badge: 'Slow listening' },
  { id: 'preview-keyboard', name: 'SoftType mechanical keyboard', category: 'Workspace', price: 6290, ratingAverage: 4.8, reviewCount: 173, stockQuantity: 13, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85', description: 'Tactile, quiet switches and a compact layout for a calmer desk.', badge: 'Desk favorite' },
  { id: 'preview-mouse', name: 'Arc wireless mouse', category: 'Workspace', price: 2190, ratingAverage: 4.5, reviewCount: 242, stockQuantity: 31, imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1000&q=85', description: 'A precise ergonomic mouse with a clean shape and long battery life.', badge: 'Workday essential' },
  { id: 'preview-notebook', name: 'Everyday linen notebook set', category: 'Workspace', price: 890, ratingAverage: 4.9, reviewCount: 156, stockQuantity: 40, imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85', description: 'Two lay-flat notebooks with smooth recycled paper for lists, plans, and stray ideas.', badge: 'Under INR 1,000' },
  { id: 'preview-desk-light', name: 'Linework adjustable desk light', category: 'Workspace', price: 3890, ratingAverage: 4.6, reviewCount: 93, stockQuantity: 12, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85', description: 'Focused warm light with an adjustable arm and a small footprint.', badge: 'Better evenings' },
  { id: 'preview-vase', name: 'Ripple stoneware vase', category: 'Home', price: 1690, ratingAverage: 4.7, reviewCount: 71, stockQuantity: 19, imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85', description: 'Hand-finished ceramic with a soft shape that works with or without stems.', badge: 'Hand finished' },
  { id: 'preview-throw', name: 'Cloud cotton throw', category: 'Home', price: 2490, ratingAverage: 4.8, reviewCount: 202, stockQuantity: 16, imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85', description: 'Breathable woven cotton for the sofa, the bed, or a cool evening outdoors.', badge: 'Soft landing' },
  { id: 'preview-planter', name: 'Little grove planter pair', category: 'Home', price: 1390, ratingAverage: 4.5, reviewCount: 88, stockQuantity: 28, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=85', description: 'Two sturdy indoor planters with drainage trays and a quietly simple finish.', badge: 'Green corner' },
  { id: 'preview-mug', name: 'Low tide ceramic mug duo', category: 'Kitchen', price: 1190, ratingAverage: 4.8, reviewCount: 121, stockQuantity: 33, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1000&q=85', description: 'A pair of balanced stoneware mugs, each with a slightly different glaze.', badge: 'Morning ritual' },
  { id: 'preview-pour-over', name: 'First light pour-over kit', category: 'Kitchen', price: 2890, ratingAverage: 4.7, reviewCount: 167, stockQuantity: 15, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85', description: 'A ceramic dripper and carafe set for a slow, reliable cup at home.', badge: 'Coffee corner' },
  { id: 'preview-knife', name: 'Good edge chef knife', category: 'Kitchen', price: 3290, ratingAverage: 4.6, reviewCount: 94, stockQuantity: 10, imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=1000&q=85', description: 'A balanced stainless steel kitchen knife with a comfortable, easy-care handle.', badge: 'Kitchen workhorse' },
  { id: 'preview-bottle', name: 'Loop insulated bottle', category: 'Travel', price: 1490, ratingAverage: 4.5, reviewCount: 254, stockQuantity: 35, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85', description: 'Keeps your drink close and your bag dry, with a wide mouth for easy cleaning.', badge: 'On the move' },
  { id: 'preview-tote', name: 'Market day canvas tote', category: 'Travel', price: 790, ratingAverage: 4.7, reviewCount: 187, stockQuantity: 45, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85', description: 'A sturdy everyday carryall with reinforced handles and a deep inside pocket.', badge: 'Under INR 1,000' },
  { id: 'preview-backpack', name: 'Roam commuter backpack', category: 'Travel', price: 4890, ratingAverage: 4.6, reviewCount: 138, stockQuantity: 12, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85', description: 'A weather-resistant daily pack with a padded laptop sleeve and useful pockets.', badge: 'Commute ready' },
  { id: 'preview-sunglasses', name: 'Sunday acetate sunglasses', category: 'Accessories', price: 2590, ratingAverage: 4.4, reviewCount: 109, stockQuantity: 21, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85', description: 'A classic frame with UV protection and a lightweight, comfortable fit.', badge: 'Sunny outlook' },
  { id: 'preview-wallet', name: 'Pocket fold card wallet', category: 'Accessories', price: 1890, ratingAverage: 4.6, reviewCount: 146, stockQuantity: 24, imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=85', description: 'A slim recycled-leather wallet with room for the cards you actually carry.', badge: 'Pocket sized' },
  { id: 'preview-scarf', name: 'Soft hours merino scarf', category: 'Accessories', price: 3490, ratingAverage: 4.8, reviewCount: 68, stockQuantity: 9, imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=85', description: 'Lightweight merino wool with a soft hand and enough warmth for changing weather.', badge: 'Natural warmth' },
  { id: 'preview-yoga-mat', name: 'Grounded everyday yoga mat', category: 'Wellness', price: 2790, ratingAverage: 4.7, reviewCount: 191, stockQuantity: 18, imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=1000&q=85', description: 'A grippy, easy-clean mat with enough cushioning for daily movement.', badge: 'Make some space' },
  { id: 'preview-candle', name: 'After rain soy candle', category: 'Wellness', price: 990, ratingAverage: 4.8, reviewCount: 230, stockQuantity: 37, imageUrl: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=85', description: 'A clean-burning soy candle with a fresh, green scent and a reusable glass jar.', badge: 'A softer evening' },
  { id: 'preview-skincare', name: 'Daily calm face care set', category: 'Wellness', price: 3190, ratingAverage: 4.5, reviewCount: 112, stockQuantity: 14, imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85', description: 'A gentle cleanser and moisturizer duo made for a simple daily routine.', badge: 'Gentle basics' },
  { id: 'preview-dumbbells', name: 'Pair of steady grip weights', category: 'Wellness', price: 1990, ratingAverage: 4.4, reviewCount: 75, stockQuantity: 7, imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=85', description: 'Compact hand weights with a comfortable finish for strength work at home.', badge: 'Home movement' },
  { id: 'preview-film', name: 'Color day 35mm film pack', category: 'Photography', price: 1590, ratingAverage: 4.6, reviewCount: 129, stockQuantity: 20, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85', description: 'Two rolls of versatile color film for everyday light and unplanned moments.', badge: 'Shoot a little slower' },
  { id: 'preview-tripod', name: 'Pocket fold camera tripod', category: 'Photography', price: 2290, ratingAverage: 4.5, reviewCount: 57, stockQuantity: 11, imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=1000&q=85', description: 'A light, fold-flat tripod for sharper night shots and steadier video.', badge: 'Small but steady' },
  { id: 'preview-print', name: 'Weekend photo print box', category: 'Photography', price: 1290, ratingAverage: 4.9, reviewCount: 91, stockQuantity: 29, imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1000&q=85', description: 'A set of archival-quality prints to bring a favorite camera roll into the room.', badge: 'Make it tangible' },
  { id: 'preview-shelf', name: 'Form and function wall shelf', category: 'Home', price: 3790, ratingAverage: 4.6, reviewCount: 82, stockQuantity: 8, imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1000&q=85', description: 'A compact solid-wood shelf for the books and objects you like seeing every day.', badge: 'Wall space well used' },
  { id: 'preview-bowl', name: 'Sunday serving bowl', category: 'Kitchen', price: 1790, ratingAverage: 4.8, reviewCount: 65, stockQuantity: 17, imageUrl: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1000&q=85', description: 'A wide, durable stoneware bowl for shared salads, fruit, or the counter.', badge: 'Made to share' },
  { id: 'preview-alarm', name: 'Slow start analog alarm clock', category: 'Home', price: 2190, ratingAverage: 4.5, reviewCount: 118, stockQuantity: 14, imageUrl: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1000&q=85', description: 'A quiet-sweep bedside clock with a clear face and gentle wake-up bell.', badge: 'Bedside calm' },
  { id: 'preview-pouch', name: 'Tidy travels cable pouch', category: 'Travel', price: 1090, ratingAverage: 4.7, reviewCount: 153, stockQuantity: 27, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85', description: 'A padded organizer to keep chargers, earbuds, and small essentials in one place.', badge: 'Little organizer' },
]
const categories = ['Everything', 'Audio', 'Home', 'Kitchen', 'Photography', 'Accessories', 'Workspace', 'Travel', 'Wellness']
const coupons = [
  { code: 'GOODFIRST10', title: 'A little welcome', detail: '10% off your first order over INR 2,500', minimum: 2500, percent: 10, accent: 'sage' },
  { code: 'SLOWMORNING', title: 'Slow morning treat', detail: 'INR 300 off home and kitchen finds over INR 2,000', minimum: 2000, discount: 300, accent: 'clay' },
  { code: 'AUDIOLOVE', title: 'Listen a little longer', detail: 'INR 500 off audio picks over INR 4,000', minimum: 4000, discount: 500, accent: 'gold' },
  { code: 'GOODBAG15', title: 'A fuller good bag', detail: '15% off orders over INR 8,000', minimum: 8000, percent: 15, accent: 'rose' },
]
const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount || 0))
const normalizeProduct = (product) => ({ ...product, id: product.id ?? product.productId, category: product.category?.name ?? product.category ?? 'Finds', price: Number(product.price), ratingAverage: Number(product.ratingAverage ?? 4.6), reviewCount: Number(product.reviewCount ?? 0) })

function App() {
  const [products, setProducts] = useState(curatedProducts)
  const [apiAvailable, setApiAvailable] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Everything')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('featured')
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('dealai-cart') || '[]'))
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('dealai-wishlist') || '[]'))
  const [activeProduct, setActiveProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [couponsOpen, setCouponsOpen] = useState(false)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [showWishlistOnly, setShowWishlistOnly] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('dealai-user') || 'null') } catch { return null } })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [botOpen, setBotOpen] = useState(false)
  const [botMessages, setBotMessages] = useState([{ from: 'bot', text: "Hi, I am DealBot. I compare the details behind a deal, not just the sticker price. What are you looking for?" }])
  const [botInput, setBotInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatProvider, setChatProvider] = useState('unknown')
  const [dealResult, setDealResult] = useState(null)
  const [dealLoading, setDealLoading] = useState(false)
  const messageEndRef = useRef(null)

  useEffect(() => {
    let ignore = false
    fetch('/api/products', { headers: { Authorization: `Bearer ${localStorage.getItem('dealai-token') || ''}` } }).then((response) => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json() }).then((data) => {
      if (ignore || !Array.isArray(data)) return
      setApiAvailable(true)
      if (data.length) {
        const curatedByName = new Map(curatedProducts.map((product) => [product.name.toLowerCase(), product]))
        const liveProducts = data.map((product) => {
          const normalized = normalizeProduct(product)
          return { ...curatedByName.get(normalized.name.toLowerCase()), ...normalized }
        })
        setProducts(liveProducts)
      }
    }).catch(() => setApiAvailable(false))
    return () => { ignore = true }
  }, [])
  useEffect(() => { localStorage.setItem('dealai-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('dealai-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  useEffect(() => {
    const token = localStorage.getItem('dealai-token')
    if (!user || !token || !products.length) return undefined
    let ignore = false
    Promise.all([
      fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(async ([cartResponse, wishlistResponse]) => {
      if (ignore) return
      if (cartResponse.ok) {
        const cartData = await cartResponse.json()
        setCart((cartData.items || []).map((item) => ({
          cartItemId: item.id,
          quantity: item.quantity,
          product: products.find((product) => product.id === item.productId) || normalizeProduct({ id: item.productId, name: item.productName, price: item.unitPrice }),
        })))
      }
      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json()
        setWishlist(wishlistData.map((item) => item.product?.id).filter(Boolean))
      }
    }).catch(() => {})
    return () => { ignore = true }
  }, [user, products])
  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [botMessages, botOpen])
  useEffect(() => {
    if (!activeProduct || typeof activeProduct.id !== 'number') return undefined
    let ignore = false
    const timer = window.setTimeout(() => {
      fetch(`/api/deals/products/${activeProduct.id}/recommendation`, { headers: { Authorization: `Bearer ${localStorage.getItem('dealai-token') || ''}` } }).then((response) => { if (!response.ok) throw new Error('Deal check unavailable'); return response.json() }).then((result) => { if (!ignore) setDealResult(result) }).catch(() => { if (!ignore) setDealResult({ unavailable: true }) }).finally(() => { if (!ignore) setDealLoading(false) })
    }, 1800)
    return () => { ignore = true; window.clearTimeout(timer) }
  }, [activeProduct])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'Everything' || product.category === selectedCategory
      const matchesWishlist = !showWishlistOnly || wishlist.includes(product.id)
      const query = searchTerm.trim().toLowerCase()
      return matchesCategory && matchesWishlist && (!query || `${product.name} ${product.category} ${product.description || ''}`.toLowerCase().includes(query))
    })
    if (sortOrder === 'price-low') return [...filtered].sort((a, b) => a.price - b.price)
    if (sortOrder === 'price-high') return [...filtered].sort((a, b) => b.price - a.price)
    if (sortOrder === 'rating') return [...filtered].sort((a, b) => b.ratingAverage - a.ratingAverage)
    return filtered
  }, [products, searchTerm, selectedCategory, sortOrder, showWishlistOnly, wishlist])
  const availableCategories = useMemo(() => ['Everything', ...new Set([...categories.slice(1), ...products.map((product) => product.category)])], [products])
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const openProduct = (product) => {
    setDealResult(null)
    setDealLoading(typeof product.id === 'number')
    setActiveProduct(product)
  }

  const addToCart = async (product) => {
    const token = localStorage.getItem('dealai-token')
    if (token && typeof product.id === 'number') {
      try {
        const response = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })
        if (!response.ok) throw new Error('Could not add this item to your account cart.')
        const cartResponse = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
        if (!cartResponse.ok) throw new Error('Could not refresh your account cart.')
        const cartData = await cartResponse.json()
        setCart((cartData.items || []).map((item) => ({ cartItemId: item.id, quantity: item.quantity, product: products.find((entry) => entry.id === item.productId) || normalizeProduct({ id: item.productId, name: item.productName, price: item.unitPrice }) })))
      } catch (error) {
        window.alert(error.message)
        return
      }
    } else {
      setCart((current) => {
        const match = current.find((item) => item.product.id === product.id)
        return match ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]
      })
    }
    setCartOpen(true)
  }
  const changeQuantity = async (productId, delta) => {
    const item = cart.find((entry) => entry.product.id === productId)
    const token = localStorage.getItem('dealai-token')
    if (token && item?.cartItemId) {
      const quantity = item.quantity + delta
      const response = quantity < 1
        ? await fetch(`/api/cart/items/${item.cartItemId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        : await fetch(`/api/cart/items/${item.cartItemId}?quantity=${quantity}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) { window.alert('Could not update your account cart.'); return }
      const refreshed = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
      if (refreshed.ok) {
        const cartData = await refreshed.json()
        setCart((cartData.items || []).map((entry) => ({ cartItemId: entry.id, quantity: entry.quantity, product: products.find((product) => product.id === entry.productId) || normalizeProduct({ id: entry.productId, name: entry.productName, price: entry.unitPrice }) })))
      }
      return
    }
    setCart((current) => current.map((entry) => entry.product.id === productId ? { ...entry, quantity: entry.quantity + delta } : entry).filter((entry) => entry.quantity > 0))
  }
  const removeFromCart = async (item) => {
    const token = localStorage.getItem('dealai-token')
    if (token && item.cartItemId) {
      const response = await fetch(`/api/cart/items/${item.cartItemId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) { window.alert('Could not remove this item from your account cart.'); return }
    }
    setCart((current) => current.filter((entry) => entry.product.id !== item.product.id))
  }
  const toggleWishlist = async (product) => {
    const alreadySaved = wishlist.includes(product.id)
    const token = localStorage.getItem('dealai-token')
    if (token && typeof product.id === 'number') {
      const response = await fetch(`/api/wishlist?productId=${product.id}`, { method: alreadySaved ? 'DELETE' : 'POST', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) { window.alert('Could not update your account wishlist.'); return }
    }
    setWishlist((current) => alreadySaved ? current.filter((id) => id !== product.id) : [...current, product.id])
  }

  const askForDeal = async (product = activeProduct) => {
    if (!product) { setBotMessages((messages) => [...messages, { from: 'bot', text: 'Pick an item in the collection first and I can compare it for you.' }]); return }
    setBotOpen(true)
    if (typeof product.id !== 'number') {
      setDealResult({ unavailable: true })
      setBotMessages((messages) => [...messages, { from: 'bot', text: 'This preview item is not in the live catalog yet, so I cannot check marketplace offers for it. Open the headphones listing to try the live deal engine.' }])
      return
    }
    setDealLoading(true)
    setBotMessages((messages) => [...messages, { from: 'bot', text: `Checking current demo offers for ${product.name}...` }])
    try {
      const response = await fetch(`/api/deals/products/${product.id}/recommendation`, { headers: { Authorization: `Bearer ${localStorage.getItem('dealai-token') || ''}` } })
      if (!response.ok) throw new Error('Deal check failed')
      const result = await response.json()
      setDealResult(result)
      setBotMessages((messages) => [...messages, { from: 'bot', text: result.message, showDealScore: result.betterDealFound }])
    } catch {
      setDealResult({ unavailable: true })
      setBotMessages((messages) => [...messages, { from: 'bot', text: 'I could not reach the deal service just now. Make sure the backend is running and try again.' }])
    } finally { setDealLoading(false) }
  }
  const sendBotMessage = async (text = botInput) => {
    const cleaned = text.trim()
    if (!cleaned || chatLoading) return
    const history = botMessages.slice(-8).map((message) => ({
      role: message.from === 'you' ? 'user' : 'model',
      text: message.text,
    }))
    setBotMessages((messages) => [...messages, { from: 'you', text: cleaned }])
    setBotInput('')
    const intent = cleaned.toLowerCase()
    if (intent.includes('cart') || intent.includes('bag')) {
      const cartSummary = cart.length
        ? `Your bag has ${cartCount} item${cartCount === 1 ? '' : 's'}:\n${cart.map((item) => `${item.quantity} x ${item.product.name} - ${money(item.product.price * item.quantity)}`).join('\n')}\nSubtotal: ${money(cartTotal)}.`
        : 'Your bag is empty right now. Add something from the collection and I can keep track of it here.'
      setBotMessages((messages) => [...messages, { from: 'bot', text: cartSummary }])
      return
    }
    const asksForComparison = ['deal', 'price', 'save', 'compare', 'cheaper'].some((term) => intent.includes(term))
    let currentDeal = dealResult
    if (asksForComparison && activeProduct && typeof activeProduct.id === 'number') {
      try {
        const dealResponse = await fetch(`/api/deals/products/${activeProduct.id}/recommendation`)
        if (dealResponse.ok) {
          currentDeal = await dealResponse.json()
          setDealResult(currentDeal)
        }
      } catch {
        currentDeal = null
      }
    }

    setChatLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleaned,
          history,
          productContext: activeProduct ? JSON.stringify({
            name: activeProduct.name,
            category: activeProduct.category,
            price: activeProduct.price,
            rating: activeProduct.ratingAverage,
            reviewCount: activeProduct.reviewCount,
            description: activeProduct.description,
          }) : '',
          dealContext: currentDeal && !currentDeal.unavailable ? JSON.stringify(currentDeal) : '',
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.message?.includes('GEMINI_API_KEY')) setChatProvider('missing-key')
        throw new Error(result.message || 'DealBot could not reply. Please try again.')
      }
      setChatProvider(result.provider || 'Gemini')
      setBotMessages((messages) => [...messages, { from: 'bot', text: result.reply, showDealScore: asksForComparison && currentDeal?.betterDealFound }])
    } catch (error) {
      setBotMessages((messages) => [...messages, { from: 'bot', text: error.message || 'I could not reach Gemini. Check the backend and try again.' }])
    } finally {
      setChatLoading(false)
    }
  }
  const submitAuth = async (event) => {
    event.preventDefault()
    setAuthError('')
    try {
      const response = await fetch(`/api/auth/${authMode === 'login' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authMode === 'login' ? { email: authForm.email, password: authForm.password } : authForm) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'We could not sign you in. Check your details and try again.')
      localStorage.setItem('dealai-token', result.token)
      const signedInUser = { email: result.email, fullName: result.fullName, role: result.role }
      localStorage.setItem('dealai-user', JSON.stringify(signedInUser))
      setUser(signedInUser)
      setAuthOpen(false)
      setAuthForm({ fullName: '', email: '', password: '' })
    } catch (error) { setAuthError(error.message || 'The account service is unavailable. Start the backend and try again.') }
  }
  const checkout = async () => {
    if (cart.some((item) => typeof item.product.id !== 'number')) {
      window.alert('This bag contains preview-only products. Remove those items and add live catalog products before checkout.')
      return
    }
    const token = localStorage.getItem('dealai-token')
    if (!token) { setCartOpen(false); setAuthOpen(true); return }
    try {
      const response = await fetch('/api/orders/checkout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('Checkout could not be completed. Please review your cart.')
      setCart([])
      setCartOpen(false)
      window.alert('Order placed. You can find it in your orders.')
    } catch (error) { window.alert(error.message) }
  }
  const signOut = () => { localStorage.removeItem('dealai-token'); localStorage.removeItem('dealai-user'); setUser(null); setAccountOpen(false) }

  const openOrders = async () => {
    setAccountOpen(false)
    setOrdersOpen(true)
    setOrdersError('')
    const token = localStorage.getItem('dealai-token')
    if (!token) {
      setOrdersError('Sign in to view your order history.')
      return
    }
    setOrdersLoading(true)
    try {
      const response = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Could not load order history.')
      setOrders(Array.isArray(result) ? result : [])
    } catch (error) {
      setOrdersError(error.message || 'Could not load order history.')
    } finally {
      setOrdersLoading(false)
    }
  }

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCoupon(code)
      window.setTimeout(() => setCopiedCoupon(''), 2200)
    } catch {
      setCopiedCoupon('copy-unavailable')
    }
  }

  return <div className="app-shell">
    <div className="announcement-bar"><span className="announcement-mark"><Sparkles size={13} /></span><span>Thoughtful finds. Better prices. A little less scrolling.</span><a href="#collection">Explore the edit <ArrowRight size={13} /></a></div>
    <header className="site-header">
      <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(!mobileNavOpen)}><Menu size={20} /></button>
      <a className="wordmark" href="#top" aria-label="Good Finds home"><span className="wordmark-symbol"><span /></span><span>good<span className="wordmark-dot">.</span>finds</span></a>
      <nav className={`main-nav ${mobileNavOpen ? 'nav-open' : ''}`} aria-label="Main navigation"><a href="#collection" onClick={() => { setShowWishlistOnly(false); setSelectedCategory('Everything'); setMobileNavOpen(false) }}>Shop all</a><a href="#collection" onClick={() => { setShowWishlistOnly(false); setSelectedCategory('Audio'); setMobileNavOpen(false) }}>Audio</a><a href="#collection" onClick={() => { setShowWishlistOnly(false); setSelectedCategory('Home'); setMobileNavOpen(false) }}>Home & living</a><button onClick={() => { setShowWishlistOnly(true); setSelectedCategory('Everything'); setMobileNavOpen(false); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Saved</button><button onClick={() => { setCouponsOpen(true); setMobileNavOpen(false) }}>My coupons</button></nav>
      <div className="header-actions"><label className="header-search" aria-label="Search the collection"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Find your thing" /><kbd>/</kbd></label>{user ? <button className="user-button" onClick={() => setAccountOpen(true)} title="Open account menu">{user.fullName?.slice(0, 1) || user.email?.slice(0, 1) || 'U'}</button> : <button className="icon-button account-button" aria-label="Sign in" onClick={() => { setAuthMode('login'); setAuthOpen(true) }}><span>Sign in</span></button>}<button className="bag-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span className="bag-label">Bag</span><span className="bag-count">{cartCount}</span></button></div>
    </header>
    <main id="top">
      <section className="hero-section" aria-labelledby="hero-title"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> THE GOOD STUFF, FOUND</div><h1 id="hero-title">Keep the things<br />that <em>make you feel.</em></h1><p>Useful things, made beautifully. We find the good ones, then help you find the better deal.</p><a className="primary-button hero-button" href="#collection">Shop the collection <ArrowRight size={16} /></a><div className="hero-footnote"><span className="online-dot" /> Curated with care <span className="footnote-divider">/</span> compared by DealBot</div></div><div className="hero-visual"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1500&q=90" alt="Sunlit living space with a considered selection of everyday objects" /><div className="hero-image-label"><span>THE SLOW MORNING EDIT</span><span>01 / 04</span></div><div className="hero-sticker"><span>GOOD<br />THINGS<br /><i>inside.</i></span><Sparkles size={15} /></div></div><div className="hero-index">01 <span /> 04</div></section>
      <section className="service-strip" aria-label="Shopping benefits"><div><Truck size={17} /><span>Free delivery over INR 2,000</span></div><span className="service-separator" /><div><ShieldCheck size={17} /><span>Thoughtful, tested picks</span></div><span className="service-separator" /><div><Sparkles size={17} /><span>DealBot checks before you commit</span></div><div className={`api-status ${apiAvailable ? 'is-live' : ''}`}><span />{apiAvailable ? 'Live catalog' : 'Curated edit'}</div></section>
      <section className="collection-section" id="collection"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {showWishlistOnly ? 'YOUR SAVED EDIT' : 'THE CURRENT EDIT'}</div><h2>{showWishlistOnly ? <>Things you <em>kept close.</em></> : <>Objects with <em>a point of view.</em></>}</h2><p>{showWishlistOnly ? 'Your saved finds, all in one place.' : 'Fewer things. Better chosen. All worth a second look.'}</p></div><a href="#our-promise" className="text-link desktop-link">A little about how we choose <ArrowUpRight size={15} /></a></div>
        <div className="collection-tools"><div className="category-tabs" role="tablist" aria-label="Filter products by category">{availableCategories.map((category) => <button key={category} role="tab" aria-selected={selectedCategory === category} className={selectedCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div><label className="sort-control"><ArrowDownWideNarrow size={15} /><span>Sort</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={14} /></label></div>
        <div className="results-meta"><span>{filteredProducts.length} considered finds</span><span className="results-right">Prices in INR <span /> Updated just now</span></div>
        {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" key={product.id} style={{ '--card-index': index }}><button className="product-image-button" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><img className="product-image" src={product.imageUrl || curatedProducts[index % curatedProducts.length].imageUrl} alt={product.name} loading="lazy" />{product.badge && <span className="product-badge">{product.badge}</span>}{typeof product.id === 'number' && <span className="live-tag"><span /> LIVE</span>}<span className="quick-view">Take a closer look <ArrowUpRight size={14} /></span></button><button className={`wishlist-button ${wishlist.includes(product.id) ? 'wishlisted' : ''}`} aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(product)}><Heart size={17} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button><div className="product-info"><div className="product-kicker"><span>{product.category}</span><span className="rating"><Star size={12} fill="currentColor" /> {product.ratingAverage.toFixed(1)} <span>({product.reviewCount})</span></span></div><button className="product-name" onClick={() => openProduct(product)}>{product.name}</button><div className="product-bottom"><strong>{money(product.price)}</strong><button className="add-button" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}><Plus size={17} /><span>Add</span></button></div></div></article>)}</div> : <div className="empty-search"><Heart size={23} /><h3>{showWishlistOnly ? 'No saved finds just yet.' : 'Nothing in this edit yet.'}</h3><p>{showWishlistOnly ? 'Tap the heart on anything you want to keep close.' : 'Try a different search or browse everything.'}</p><button className="text-link" onClick={() => { setSearchTerm(''); setSelectedCategory('Everything'); setShowWishlistOnly(false) }}>Browse the edit <ArrowRight size={14} /></button></div>}
        <div className="collection-end"><span /> THAT'S THE EDIT <span /></div></section>
      <section className="promise-section" id="our-promise"><div className="promise-image"><img src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85" alt="Thoughtfully arranged home essentials" loading="lazy" /><span className="promise-image-caption">BUY LESS, LOVE IT LONGER.</span></div><div className="promise-copy"><div className="eyebrow"><span className="eyebrow-line" /> A BETTER WAY TO BROWSE</div><h2>Good taste.<br /><em>Better math.</em></h2><p>We bring together useful objects with a little more intention. Then DealBot looks past the headline price: delivery, ratings, reviews and the real total all count.</p><div className="promise-points"><div><span>01</span><p><strong>Considered, not endless.</strong><br />A smaller edit, chosen for a reason.</p></div><div><span>02</span><p><strong>Price is only part of it.</strong><br />DealBot helps you compare the whole picture.</p></div></div><button className="outline-button" onClick={() => { setBotOpen(true); setBotMessages((messages) => [...messages, { from: 'bot', text: 'I weigh total cost, delivery speed, seller rating, and review volume. A tiny discount wonâ€™t win if another option is more dependable.' }]) }}>Meet your shopping sidekick <MessageCircle size={16} /></button></div></section>
      <section className="newsletter-section"><div className="newsletter-spark"><Sparkles size={20} /></div><div><div className="eyebrow">A NOTE FROM THE GOOD SIDE</div><h2>Good finds, occasionally.</h2><p>No noise. Just a little inspiration and a deal worth knowing about.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); window.alert('Youâ€™re on the list. Talk soon.') }}><input type="email" placeholder="Your email address" aria-label="Email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button></form></section>
    </main>
    <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-symbol"><span /></span><span>good<span className="wordmark-dot">.</span>finds</span></a><span>Useful things. Better choices.</span><span>(c) 2026 good.finds / DealAI</span><a href="#top">Back to top</a></footer>

    <button className={`dealbot-launcher ${botOpen ? 'launcher-open' : ''}`} onClick={() => setBotOpen(!botOpen)} aria-label={botOpen ? 'Close DealBot' : 'Open DealBot chat'}>{botOpen ? <X size={21} /> : <><span className="bot-orbit"><Bot size={23} /></span><span className="bot-launcher-copy"><strong>DealBot</strong><small>your second opinion</small></span><span className="bot-online-indicator" /></>}</button>
    {botOpen && <aside className="dealbot-panel" aria-label="DealBot chat"><div className="bot-panel-head"><div className="bot-avatar"><Bot size={20} /></div><div className="bot-title"><strong>DealBot</strong><span><i /> {chatProvider === 'Gemini' ? 'Gemini AI connected' : chatProvider === 'missing-key' ? 'Gemini setup needed' : 'AI chat ready'}</span></div><button className="icon-button bot-close" onClick={() => setBotOpen(false)} aria-label="Close chat"><X size={17} /></button></div><div className="bot-context"><Sparkles size={14} /><span>{activeProduct ? `Looking at ${activeProduct.name}` : 'Your thoughtful shopping companion'}</span></div><div className="bot-messages" aria-live="polite">{botMessages.map((message, index) => <div className={`chat-message ${message.from === 'you' ? 'from-you' : 'from-bot'}`} key={`${index}-${message.text}`}><div className="message-avatar">{message.from === 'bot' ? <Sparkles size={12} /> : 'You'}</div><div className="message-bubble">{message.text}{index === botMessages.length - 1 && dealResult?.betterDealFound && message.from === 'bot' && <div className="chat-score"><span>DEAL SCORE</span><strong>{dealResult.dealScore}<small>/100</small></strong></div>}</div></div>)}{(dealLoading || chatLoading) && <div className="bot-typing"><span /><span /><span /> {chatLoading ? 'Gemini is thinking' : 'checking the numbers'}</div>}<div ref={messageEndRef} /></div><div className="suggested-prompts"><button onClick={() => askForDeal()}>Check this deal <ArrowRight size={12} /></button><button onClick={() => sendBotMessage('What is in my cart?')}>My bag</button></div><form className="bot-input-row" onSubmit={(event) => { event.preventDefault(); sendBotMessage() }}><input value={botInput} onChange={(event) => setBotInput(event.target.value)} placeholder="Ask me anything..." aria-label="Message DealBot" /><button type="submit" aria-label="Send message" disabled={!botInput.trim() || chatLoading}><Send size={16} /></button></form><div className="bot-disclaimer"><CircleHelp size={12} /> Offers are seeded demo data, not live marketplace prices.</div></aside>}

    {activeProduct && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProduct(null) }}><section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="icon-button modal-close" onClick={() => setActiveProduct(null)} aria-label="Close product details"><X size={20} /></button><div className="modal-product-image"><img src={activeProduct.imageUrl || curatedProducts[0].imageUrl} alt={activeProduct.name} /></div><div className="modal-product-details"><div className="eyebrow"><span className="eyebrow-line" /> {activeProduct.category.toUpperCase()}</div><h2 id="detail-title">{activeProduct.name}</h2><div className="detail-rating"><Star size={14} fill="currentColor" /> {activeProduct.ratingAverage.toFixed(1)} <span>({activeProduct.reviewCount} considered reviews)</span></div><div className="detail-price">{money(activeProduct.price)}</div><p>{activeProduct.description || 'A considered find, selected for quality, usefulness, and everyday longevity.'}</p><div className="detail-perks"><span><Truck size={15} /> Free delivery over INR 2,000</span><span><ShieldCheck size={15} /> Carefully selected</span></div>{dealLoading && <div className="deal-check-card checking"><Sparkles size={17} /><span>DealBot is checking the whole picture...</span><span className="loading-dots">â€¢â€¢â€¢</span></div>}{!dealLoading && dealResult?.betterDealFound && <div className="deal-check-card has-deal"><div className="deal-card-top"><Sparkles size={16} /><span>DEALBOT FOUND AN OPTION</span><strong>{dealResult.dealScore}/100</strong></div><p>{dealResult.message}</p>{dealResult.productUrl && <a href={dealResult.productUrl} target="_blank" rel="noreferrer">View {dealResult.platform} offer <ArrowUpRight size={14} /></a>}</div>}{!dealLoading && dealResult && !dealResult.betterDealFound && <div className="deal-check-card no-deal"><Check size={16} /><span>{dealResult.unavailable ? 'Deal check is unavailable for this preview item.' : dealResult.message}</span></div>}{!dealResult && !dealLoading && typeof activeProduct.id !== 'number' && <div className="deal-check-card no-deal"><Sparkles size={16} /><span>Ask DealBot about the live catalog item to compare seeded offers.</span></div>}<div className="detail-actions"><button className="primary-button" onClick={() => addToCart(activeProduct)}>Add to bag <Plus size={16} /></button><button className="outline-button detail-bot-button" onClick={() => { setBotOpen(true); askForDeal(activeProduct) }}><Bot size={17} /> Ask DealBot</button></div></div></section></div>}

    {cartOpen && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="drawer-heading"><div><div className="eyebrow">YOUR GOOD FINDS</div><h2 id="cart-title">Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={20} /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-line" key={item.product.id}><img src={item.product.imageUrl || curatedProducts[0].imageUrl} alt="" /><div className="cart-line-info"><span>{item.product.category}</span><strong>{item.product.name}</strong><b>{money(item.product.price)}</b><div className="quantity-control"><button onClick={() => changeQuantity(item.product.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.product.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div><button className="remove-line" onClick={() => removeFromCart(item)} aria-label={`Remove ${item.product.name}`}><X size={15} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(cartTotal)}</strong></div><p>Delivery is on us for orders over INR 2,000.</p><button className="primary-button checkout-button" onClick={checkout}>Continue to checkout <ArrowRight size={16} /></button><button className="continue-shopping" onClick={() => setCartOpen(false)}>Keep looking</button></div></> : <div className="empty-cart"><div className="empty-bag-icon"><ShoppingBag size={25} /></div><h3>A good find is waiting.</h3><p>Your bag is empty for now. Take a look around.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Explore the edit <ArrowRight size={15} /></button></div>}</aside></div>}

    {authOpen && <div className="modal-backdrop auth-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false) }}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="icon-button modal-close" onClick={() => setAuthOpen(false)} aria-label="Close sign in"><X size={19} /></button><div className="auth-mark"><span className="wordmark-symbol"><span /></span></div><div className="eyebrow">GOOD TO HAVE YOU</div><h2 id="auth-title">{authMode === 'login' ? 'Welcome back.' : 'Come on in.'}</h2><p>{authMode === 'login' ? 'Sign in to check out and pick up where you left off.' : 'Create an account to keep your bag and orders together.'}</p><form className="auth-form" onSubmit={submitAuth}>{authMode === 'register' && <label>Your name<input autoComplete="name" value={authForm.fullName} onChange={(event) => setAuthForm({ ...authForm, fullName: event.target.value })} required /></label>}<label>Email address<input type="email" autoComplete="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} required /></label><label>Password<input type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength="6" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} required /></label>{authError && <p className="auth-error">{authError}</p>}<button className="primary-button" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={15} /></button></form><div className="auth-switch">{authMode === 'login' ? 'New around here?' : 'Already have an account?'} <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError('') }}>{authMode === 'login' ? 'Create an account' : 'Sign in'}</button></div></section></div>}
    {accountOpen && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccountOpen(false) }}><aside className="account-drawer" role="dialog" aria-modal="true" aria-labelledby="account-title"><div className="drawer-heading"><div><div className="eyebrow">YOUR GOOD FINDS ACCOUNT</div><h2 id="account-title">Hello, {user?.fullName?.split(' ')[0] || 'there'}.</h2></div><button className="icon-button" onClick={() => setAccountOpen(false)} aria-label="Close account"><X size={20} /></button></div><button className="account-menu-item" onClick={openOrders}><Package size={18} /><span><strong>My orders</strong><small>Track the things on their way</small></span><ArrowRight size={15} /></button><button className="account-menu-item" onClick={() => { setAccountOpen(false); setShowWishlistOnly(true); setSelectedCategory('Everything'); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}><Heart size={18} /><span><strong>Saved finds</strong><small>{wishlist.length} things kept close</small></span><ArrowRight size={15} /></button><button className="account-menu-item" onClick={() => { setAccountOpen(false); setCouponsOpen(true) }}><TicketPercent size={18} /><span><strong>My coupons</strong><small>Offers for your next good find</small></span><ArrowRight size={15} /></button><button className="account-signout" onClick={signOut}>Sign out</button></aside></div>}
    {couponsOpen && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCouponsOpen(false) }}><aside className="account-drawer coupon-drawer" role="dialog" aria-modal="true" aria-labelledby="coupons-title"><div className="drawer-heading"><div><div className="eyebrow">A LITTLE SOMETHING EXTRA</div><h2 id="coupons-title">My coupons</h2></div><button className="icon-button" onClick={() => setCouponsOpen(false)} aria-label="Close coupons"><X size={20} /></button></div><p className="drawer-intro">A few good codes for your next order. Copy one to keep it handy.</p><div className="coupon-list">{coupons.map((coupon) => <article className={`coupon-item coupon-${coupon.accent}`} key={coupon.code}><div className="coupon-item-top"><span className="coupon-icon"><TicketPercent size={17} /></span><span className="coupon-value">{coupon.percent ? `${coupon.percent}% off` : money(coupon.discount)}</span></div><h3>{coupon.title}</h3><p>{coupon.detail}</p><div className="coupon-code-row"><code>{coupon.code}</code><button onClick={() => copyCoupon(coupon.code)}>{copiedCoupon === coupon.code ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy code</>}</button></div></article>)}</div><p className="coupon-note">Demo offers for this project. Coupon codes are not applied to backend checkout yet.</p>{copiedCoupon === 'copy-unavailable' && <p className="coupon-copy-error">Clipboard permission unavailable. Select and copy a code manually.</p>}</aside></div>}
    {ordersOpen && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOrdersOpen(false) }}><aside className="account-drawer orders-drawer" role="dialog" aria-modal="true" aria-labelledby="orders-title"><div className="drawer-heading"><div><div className="eyebrow">THE THINGS YOU CHOSE</div><h2 id="orders-title">My orders</h2></div><button className="icon-button" onClick={() => setOrdersOpen(false)} aria-label="Close orders"><X size={20} /></button></div>{ordersLoading ? <p className="drawer-intro">Loading your orders...</p> : ordersError ? <p className="orders-message">{ordersError}</p> : orders.length ? <div className="order-list">{orders.map((order) => <article className="order-item" key={order.id}><div><span>ORDER #{order.id}</span><b>{order.status}</b></div><strong>{money(order.totalAmount)}</strong><small>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently placed'} · {order.items?.length || 0} items</small></article>)}</div> : <div className="orders-empty"><Package size={27} /><h3>No orders yet</h3><p>Your future favorites will show up here.</p><button className="outline-button" onClick={() => { setOrdersOpen(false); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }) }}>Browse the edit <ArrowRight size={14} /></button></div>}</aside></div>}
    <div className="mobile-bottom-bar"><a href="#collection"><ShoppingBag size={17} /><span>Shop</span></a><button onClick={() => setCartOpen(true)}><ShoppingBag size={17} /><span>Bag</span><b>{cartCount}</b></button><button onClick={() => setBotOpen(true)}><Bot size={17} /><span>DealBot</span></button></div>
  </div>
}

export default App
