<div align="center">
  <img src="./src/assets/book-cover.svg" alt="Uknuta Magia Book Cover" width="200"/>
  <h1>Uknuta Magia - Book Landing Page</h1>
  <p>Professional book landing page and order management system for children's book "Uknuta Magia" by Adrian Knut</p>

[![Live Website](https://img.shields.io/badge/Live-uknutamagia.pl-success?style=for-the-badge)](https://uknutamagia.pl)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)
</div>

---

# Uknuta Magia - Book Landing Page

## 📱 Project Preview

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <img src="./src/assets/book-cover.svg" alt="Uknuta Magia Book Cover" width="200"/>
        <br/>
        <strong>📚 Children's Book</strong>
        <br/>
        <em>"Uknuta Magia" by Adrian Knut</em>
      </td>
      <td align="center" width="50%">
        <img src="./src/assets/screenshots/homepage-screenshot.png" alt="Website Homepage" width="300"/>
        <br/>
        <strong>🌐 Live Website</strong>
        <br/>
        <a href="https://uknutamagia.pl">uknutamagia.pl</a>
      </td>
    </tr>
  </table>

**🛒 Complete E-commerce System** | **👨‍💼 Admin Panel** | **📧 Automated Emails** | **💳 Real Payments**
</div>

---

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** SCSS Modules
- **Database:** Supabase (PostgreSQL)
- **Email Service:** EmailJS
- **UI Icons:** Lucide React
- **Routing:** React Router DOM
- **Language:** JavaScript/JSX
- **Version Control:** Git

## ✨ Features

### 🏗️ **Architecture & Code Quality**
- [x] **Modular component architecture** - Clean, focused components
- [x] **Custom utils library** - Business logic separation
- [x] **Custom hooks system** - Reusable React logic
- [x] **SCSS Modules** - Scoped styling system
- [x] **Single responsibility principle** - Each component has one purpose

### 🛒 **E-commerce Features**
- [x] **Complete order system** - Form validation and processing
- [x] **Multiple delivery options** - Personal pickup, parcel locker, courier
- [x] **Real-time price calculation** - Dynamic pricing based on delivery
- [x] **Order status tracking** - From placement to delivery
- [x] **Payment instructions** - BLIK and traditional transfer support
- [x] **Email notifications** - Automated order confirmations

### 👨‍💼 **Admin Panel**
- [x] **Secure authentication** - Password-protected admin access
- [x] **Order management** - View, filter, and update order statuses
- [x] **Statistics dashboard** - Revenue tracking and order analytics
- [x] **Mobile-responsive design** - Desktop table + mobile cards view
- [x] **Real-time updates** - Live order status changes
- [x] **Export functionality** - Order data management

### 📱 **User Experience**
- [x] **Fully responsive design** - Mobile-first approach
- [x] **Book showcase** - Author and book information sections
- [x] **Interactive chat bot** - Book character conversations (optional)
- [x] **Cursor glow effect** - Modern visual enhancement
- [x] **Smooth animations** - Professional UI transitions
- [x] **Accessibility features** - Semantic HTML, proper contrast

### 🎨 **Content Sections**
- [x] **Hero section** - Book cover and call-to-action
- [x] **Book description** - Engaging story overview
- [x] **Author biography** - Personal story and background
- [x] **Order form** - Complete purchase flow
- [x] **Footer** - Contact information and social links

## 📁 Project Structure

```
src/
├── components/
│   ├── AdminPanel/          # Admin dashboard and management
│   ├── Chat/                # Interactive book character chat
│   ├── ContentSection/      # Reusable content display
│   ├── CursorGlow/          # Visual enhancement effect
│   ├── Footer/              # Site footer with contact info
│   ├── Header/              # Navigation and mobile menu
│   ├── OrderForm/           # Complete order processing system
│   ├── SectionHeader/       # Styled section headers
│   └── TeaserContent/       # Marketing content display
├── assets/
│   ├── book-cover.svg       # Book cover image
│   ├── author-photo.jpg     # Author photograph
│   └── screenshots/         # Project screenshots
│       └── homepage-screenshot.png
├── hooks/
│   ├── useAuth.js           # Admin authentication logic
│   ├── useFormValidation.js # Real-time form validation
│   ├── useLocalStorage.js   # Browser storage management
│   ├── useOrderForm.js      # Order form business logic
│   └── useOrders.js         # Order management and statistics
├── utils/
│   ├── api.js               # Supabase database operations
│   ├── constants.js         # Application constants and prices
│   ├── email.js             # EmailJS integration
│   ├── formatters.js        # Data formatting utilities
│   ├── priceCalculations.js # Order pricing logic
│   └── validation.js        # Form validation functions
├── config/
│   └── supabase.js          # Database configuration
├── content/
│   └── book.js              # Book and author content
├── styles/
│   ├── index.scss           # Global styles
│   └── variables.scss       # SCSS variables and themes
└── App.jsx                  # Main application router
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (for database)
- EmailJS account (for email notifications)

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/enowuigrek/uknuta-magia.git
cd uknuta-magia

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_key

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Create production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

## 🌟 Key Highlights

### **Refactored Architecture** (In Progress)
- **Utils-based approach** - Business logic separated from components
- **Custom hooks system** - Reusable React patterns
- **Modular components** - Single responsibility principle
- **Type safety** - Comprehensive validation system

### **Real Business Application**
- **Live e-commerce system** - Actual book sales processing
- **Payment integration** - BLIK and bank transfer support
- **Order fulfillment** - Complete logistics management
- **Customer communication** - Automated email workflows

### **Modern React Patterns**
- **Custom hooks** - useAuth, useOrders, useFormValidation
- **Context-free state** - Local state management with hooks
- **Validation system** - Real-time form validation
- **Error handling** - Comprehensive error management

## 💰 Business Features

### **Order Management**
- **Dynamic pricing** - Book (49.99 zł) + delivery costs
- **Three delivery options:**
  - Personal pickup (0.00 zł) - Częstochowa/Raciszyn
  - InPost parcel locker (16.99 zł)
  - Courier delivery (19.99 zł)

### **Payment Processing**
- **BLIK integration** - Phone number transfers
- **Traditional transfers** - PKO Bank Polski
- **Cash on pickup** - For personal delivery option
- **Payment tracking** - Order status management

### **Admin Features**
- **Revenue analytics** - Book sales vs delivery costs
- **Order filtering** - By status, date, delivery method
- **Status management** - Awaiting → Paid → Shipped → Delivered
- **Customer communication** - Direct contact links

## 📱 Responsive Design

Optimized for all devices:
- **Mobile devices** (320px+) - Touch-friendly interfaces
- **Tablets** (768px+) - Adaptive layouts
- **Desktop** (1024px+) - Full-featured experience
- **Large screens** (1920px+) - Optimal content presentation

## 🎯 Performance & Security

### **Performance**
- **Vite build system** - Fast development and builds
- **Component lazy loading** - Optimized bundle sizes
- **Image optimization** - Efficient asset loading
- **SCSS modules** - Scoped styling without conflicts

### **Security**
- **Admin authentication** - Password-protected access
- **Form validation** - Client and server-side validation
- **SQL injection protection** - Supabase security features
- **Email validation** - Comprehensive input sanitization

## 🌐 Deployment

**Status:** ✅ **LIVE IN PRODUCTION**

- **Hosting:** Netlify
- **Custom Domain:** [uknutamagia.pl](https://uknutamagia.pl)
- **SSL Certificate:** Active
- **Status:** Fully operational e-commerce system

Ready for deployment on other platforms:
- **Vercel**
- **GitHub Pages**
- **Any static hosting service**

## 📊 Current Status

### **Production System** ✅ **LIVE**
✅ **E-commerce website** - [uknutamagia.pl](https://uknutamagia.pl) - ACTIVE  
✅ **Order processing** - Real customers, real sales  
✅ **Payment system** - BLIK + bank transfers working  
✅ **Admin dashboard** - Live order management  
✅ **Email notifications** - Automated customer communication  
✅ **Custom domain** - Professional business presence

### **Technical Foundation**
✅ **Utils & hooks infrastructure** - Modern React architecture  
✅ **Database integration** - Supabase backend operational  
✅ **Responsive design** - Mobile-optimized for all devices

### **Development Status**
🔄 **Component refactoring** - Breaking down large components  
🔄 **Code optimization** - Improving maintainability  
🔄 **Performance enhancements** - Bundle size optimization

### **Business Metrics**
📈 **Active sales** - Processing real book orders  
📈 **Customer base** - Growing user engagement  
📈 **Revenue tracking** - Admin analytics dashboard

## 📞 Contact

**Adrian Knut** - Author & Content  
**Developed by:** [enowuigrek](https://github.com/enowuigrek)

- **Business Email:** uknutamagia@gmail.com
- **Developer Email:** enowuigrek@gmail.com
- **Phone:** +48 883 348 381
- **Location:** Częstochowa, Poland

### **Social Media**
- **Instagram:** [@uknuta_magia](https://www.instagram.com/uknuta_magia/)
- **Facebook:** [Uknuta Magia](https://www.facebook.com/profile.php?id=61575505817796)

---

## 🏆 Technical Achievements

✅ **Live E-commerce Platform** - [uknutamagia.pl](https://uknutamagia.pl)  
✅ **Real Business Operations** - Processing actual book sales  
✅ **Custom Domain Integration** - Professional business presence  
✅ **Payment System Integration** - BLIK + traditional transfers  
✅ **Real-time Order Management** - Live admin dashboard  
✅ **Modern React Architecture** - Utils & hooks foundation  
✅ **Production-grade Deployment** - Netlify with SSL  
🚀 **Scalable and Maintainable** - Ready for growth

---

Made with ❤️ for children's literature | React + SCSS + Supabase | Częstochowa, Poland 🇵🇱