import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, Plus, Minus, Facebook, Instagram, Mail, Phone, MapPin, Star, Search } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Badge } from './components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { toast } from 'react-hot-toast'

// Product interface
interface Product {
  id: number
  name: string
  price: number
  image: string
  brand: string
  capacity: string
  rating: number
  features: string[]
}

// Cart item interface
interface CartItem extends Product {
  quantity: number
}

// Sample products data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Arctic Pro 450L French Door",
    price: 1299,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
    brand: "Arctic",
    capacity: "450L",
    rating: 4.8,
    features: ["Energy Star", "Ice Maker", "Smart Controls"]
  },
  {
    id: 2,
    name: "CoolMax Premium Side-by-Side",
    price: 1899,
    image: "https://images.unsplash.com/photo-1556909114-4234831d63e4?w=400&h=400&fit=crop",
    brand: "CoolMax",
    capacity: "680L",
    rating: 4.9,
    features: ["Water Dispenser", "Touch Screen", "WiFi Enabled"]
  },
  {
    id: 3,
    name: "FrostGuard Compact 280L",
    price: 799,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    brand: "FrostGuard",
    capacity: "280L",
    rating: 4.6,
    features: ["Compact Design", "Energy Efficient", "Quiet Operation"]
  },
  {
    id: 4,
    name: "IcePeak Luxury 520L",
    price: 2199,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop&brightness=0.8",
    brand: "IcePeak",
    capacity: "520L",
    rating: 4.7,
    features: ["Dual Zone", "Voice Control", "Smart Diagnostics"]
  },
  {
    id: 5,
    name: "ChillMaster 4-Door 750L",
    price: 2799,
    image: "https://images.unsplash.com/photo-1556909114-4234831d63e4?w=400&h=400&fit=crop&brightness=1.2",
    brand: "ChillMaster",
    capacity: "750L",
    rating: 4.9,
    features: ["Family Size", "Flexible Storage", "Temperature Control"]
  },
  {
    id: 6,
    name: "EcoFreeze Green 350L",
    price: 1099,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&brightness=1.1",
    brand: "EcoFreeze",
    capacity: "350L",
    rating: 4.5,
    features: ["Eco-Friendly", "LED Lighting", "Adjustable Shelves"]
  }
]

function App() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterBrand, setFilterBrand] = useState('all')

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('fridgelogic-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('fridgelogic-cart', JSON.stringify(cart))
  }, [cart])

  // Add to cart function
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
    toast.success(`${product.name} added to cart!`)
  }

  // Update cart quantity
  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  // Calculate total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Filter and sort products
  const filteredProducts = sampleProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrand = filterBrand === 'all' || product.brand === filterBrand
      return matchesSearch && matchesBrand
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  // Get unique brands for filter
  const brands = [...new Set(sampleProducts.map(product => product.brand))]

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/fridgelogic-logo.png" 
                alt="FridgeLogic" 
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('shop')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Shop
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </button>
            </nav>

            {/* Cart and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <p className="text-blue-600 font-semibold">${item.price}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-6 border-t">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-blue-600">${cartTotal}</span>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Checkout
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-4 mt-8">
                      <button 
                        onClick={() => scrollToSection('home')}
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                      >
                        Home
                      </button>
                      <button 
                        onClick={() => scrollToSection('shop')}
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                      >
                        Shop
                      </button>
                      <button 
                        onClick={() => scrollToSection('about')}
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                      >
                        About
                      </button>
                      <button 
                        onClick={() => scrollToSection('contact')}
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                      >
                        Contact
                      </button>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/src/assets/header-kitchen.jpg')` }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Cool Logic.
              <br />
              <span className="text-cyan-200">Colder Results.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover premium refrigerators that combine cutting-edge technology with exceptional performance. 
              Serving London, Ontario with quality and reliability.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
              onClick={() => scrollToSection('shop')}
            >
              Shop Now
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premium Refrigerators
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated selection of high-quality refrigerators
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search refrigerators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBrand} onValueChange={setFilterBrand}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        {product.capacity}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium ml-1">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-blue-600 font-medium">{product.brand}</span>
                  </div>
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-4">
                    ${product.price}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About FridgeLogic
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                For over a decade, FridgeLogic has been London, Ontario's trusted source for premium refrigeration solutions. 
                We believe that the heart of every home deserves the best—refrigerators that combine innovative technology, 
                energy efficiency, and lasting reliability.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our customer-first approach means we don't just sell refrigerators; we provide comprehensive solutions 
                including delivery, installation, maintenance, and ongoing support. Every product we offer is carefully 
                selected for quality, performance, and value.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Expert Installation</h3>
                  <p className="text-gray-600">Professional setup and configuration</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Local Service</h3>
                  <p className="text-gray-600">Serving all of London, Ontario</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                  <p className="text-gray-600">Only premium, tested products</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Ongoing Support</h3>
                  <p className="text-gray-600">Maintenance and repair services</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose FridgeLogic?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>10+ years serving London, Ontario</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>1000+ satisfied customers</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Competitive pricing and financing options</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-3 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span>Same-day delivery available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to upgrade your refrigeration? Contact us for expert advice and personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <Input type="text" placeholder="Your Name" />
                </div>
                <div>
                  <Input type="email" placeholder="Your Email" />
                </div>
                <div>
                  <Textarea placeholder="Your Message" rows={5} />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-blue-200" />
                    <span>London, Ontario, Canada</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-blue-200" />
                    <span>519 630 0315</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-blue-200" />
-                    <span>info@fridgelogic.ca</span>
+                    <span>infofridgelogic@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/fridgelogic-logo.png" 
                  alt="FridgeLogic" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                London, Ontario's premier destination for high-quality refrigerators and exceptional service.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('shop')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Shop
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 FridgeLogic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App