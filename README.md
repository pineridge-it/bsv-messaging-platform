# BSV Messaging Platform

A peer-to-peer messaging platform built on the BSV blockchain with micropayments, real-time communication, and wallet-based authentication.

## 🚀 Features

### Core Messaging
- **Real-time Communication**: WebSocket-based instant messaging
- **Peer-to-Peer Architecture**: Direct communication between users
- **Message Encryption**: Client-side encryption for privacy
- **Asynchronous Messaging**: Send messages to offline users
- **Message History**: Persistent chat history with pagination
- **Contact Management**: Add and manage friends/contacts

### BSV Blockchain Integration
- **Wallet-based Authentication**: Login using BSV wallet addresses
- **Micropayments**: Pay-to-send and pay-to-receive message models
- **Flexible Pricing**: Preset pricing tiers and custom rates
- **Transaction Tracking**: Monitor payment status and history
- **Mock Integration**: Ready-to-integrate with real BSV wallet services

### User Experience
- **Modern Chat UI**: Clean, intuitive interface
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile
- **Real-time Notifications**: Instant message alerts
- **Typing Indicators**: See when contacts are typing

### Technical Features
- **NextJS Framework**: Server-side rendering and API routes
- **PostgreSQL Database**: Robust data persistence
- **WebSocket Server**: Real-time communication layer
- **RESTful API**: Clean API design for all operations
- **TypeScript**: Type-safe development

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (NextJS)      │◄──►│   (API Routes)  │◄──►│   (PostgreSQL)  │
│                 │    │   (WebSocket)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BSV Wallet    │    │   Message       │    │   User Data     │
│   Integration   │    │   Encryption    │    │   Chat History  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

- **Frontend**: NextJS 14, React 18, TypeScript, Tailwind CSS
- **Backend**: NextJS API Routes, WebSocket (ws library)
- **Database**: PostgreSQL with connection pooling
- **Authentication**: BSV wallet-based authentication
- **Encryption**: Client-side message encryption
- **Payments**: BSV micropayments integration
- **Styling**: Tailwind CSS with dark/light theme support

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/pineridge-it/bsv-messaging-platform.git
   cd bsv-messaging-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb bsv_messaging
   
   # Run database migrations
   npm run db:migrate
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/bsv_messaging
   
   # NextJS
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # WebSocket
   WS_PORT=8080
   
   # BSV Integration (Mock/Real)
   BSV_NETWORK=testnet
   BSV_API_KEY=your-api-key
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

6. **Start WebSocket Server**
   ```bash
   # In a separate terminal
   npm run ws:start
   ```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    bsv_address VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    public_key TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    encrypted_content TEXT,
    message_type VARCHAR(50) DEFAULT 'text',
    payment_amount DECIMAL(10,8),
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    contact_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, contact_id)
);
```

## 💰 BSV Integration

### Current Implementation
The platform includes a mock BSV integration with clear integration points for real wallet services:

```typescript
// Mock BSV Service (src/lib/bsv-mock.ts)
export class MockBSVService {
  async createWallet(): Promise<BSVWallet>
  async sendPayment(from: string, to: string, amount: number): Promise<Transaction>
  async getBalance(address: string): Promise<number>
  async validateAddress(address: string): Promise<boolean>
}
```

### Real BSV Integration
To integrate with real BSV services, replace the mock service with:

1. **WhatsOnChain API** for blockchain queries
2. **MoneyButton** or **HandCash** for wallet operations
3. **BSV SDK** for transaction handling

Example integration:
```typescript
import { BSV } from 'bsv-sdk';

export class RealBSVService {
  private bsv: BSV;
  
  constructor(apiKey: string) {
    this.bsv = new BSV({ apiKey, network: 'mainnet' });
  }
  
  async sendPayment(privateKey: string, to: string, amount: number) {
    const tx = this.bsv.Transaction()
      .from(utxos)
      .to(to, amount)
      .sign(privateKey);
    
    return await this.bsv.broadcast(tx);
  }
}
```

## 🔐 Security Features

- **Client-side Encryption**: Messages encrypted before transmission
- **Wallet-based Auth**: Secure authentication using BSV signatures
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Protection against spam and abuse
- **HTTPS Only**: Secure communication in production
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### Docker Deployment
```bash
docker build -t bsv-messaging-platform .
docker run -p 3000:3000 bsv-messaging-platform
```

### Environment Setup
Ensure the following environment variables are configured in production:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `BSV_API_KEY`
- `WS_PORT`

## 📱 API Documentation

### Authentication
```typescript
POST /api/auth/login
{
  "bsvAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "signature": "signature_string"
}
```

### Messaging
```typescript
POST /api/messages/send
{
  "recipientId": 123,
  "content": "Hello World",
  "paymentAmount": 0.001
}

GET /api/messages/history?contactId=123&page=1&limit=50
```

### Contacts
```typescript
POST /api/contacts/add
{
  "bsvAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}

GET /api/contacts/list
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testPathPattern=messages
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [BSV Documentation](https://docs.bitcoinsv.io/)
- [NextJS Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Group messaging functionality
- [ ] File sharing with micropayments
- [ ] Voice/video calling integration
- [ ] Advanced BSV smart contracts
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

Built with ❤️ using BSV blockchain technology