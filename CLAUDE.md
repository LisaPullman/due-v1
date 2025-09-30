# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FoxAI记账软件 (FoxAI Accounting Software) is a Node.js-based personal finance tracking application designed for recording trading profits/losses with intelligent risk management features. Currently in planning/documentation phase with no implementation code.

## Key Architecture Decisions

### Technology Stack
- **Frontend**: Next.js with React/TypeScript (for Vercel deployment)
- **Backend**: Vercel Serverless Functions (API Routes)
- **Database**: Vercel KV (Redis-compatible, free tier)
- **Cross-platform**: Electron (desktop) + PWA (mobile)

### Core Features
1. **Transaction Recording**: Manual entry of profit/loss transactions
2. **Risk Management**: Automatic 24-hour trading suspension after 2 consecutive losses
3. **Statistics**: Daily/weekly/monthly profit/loss analysis
4. **FoxAI Branding**: Prominent logo display
5. **Free Vercel Deployment**: Optimized for free tier limitations

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Database Management
```bash
# Create Vercel KV database
kv create foxai-accounting-db

# Test KV connection locally
vercel dev
```

## Code Architecture

### Project Structure (Vercel Architecture)
```
foxai-accounting-vercel/
├── pages/                    # Next.js pages and API routes
│   ├── index.tsx            # Homepage with transaction form
│   ├── statistics.tsx       # Statistics dashboard
│   ├── settings.tsx         # User settings
│   └── api/                 # Serverless API functions
│       ├── transactions.ts  # CRUD operations for transactions
│       ├── statistics.ts    # Statistics calculations
│       └── risk.ts         # Risk management logic
├── components/              # React components
│   ├── TransactionForm.tsx  # Data entry form
│   ├── RiskAlert.tsx       # Risk warning display
│   ├── FoxAILogo.tsx       # Brand logo component
│   └── StatisticsChart.tsx # Chart components
├── lib/                     # Utility libraries
│   ├── kv-service.ts       # Vercel KV data access layer
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Helper functions
├── styles/                  # CSS/styling files
└── public/                  # Static assets
```

### Key Data Models
```typescript
interface Transaction {
  id: string;
  date: string;           // YYYY-MM-DD
  amount: number;         // positive=profit, negative=loss
  type: 'profit' | 'loss';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskStatus {
  isInRisk: boolean;
  consecutiveLosses: number;
  lastRiskDate?: string;
}

interface Settings {
  currency: string;           // Default: '¥'
  riskAlertEnabled: boolean;
  theme: 'light' | 'dark';
}
```

### API Endpoints
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/statistics/daily` - Daily statistics
- `GET /api/statistics/weekly` - Weekly statistics
- `GET /api/statistics/monthly` - Monthly statistics
- `GET /api/risk/status` - Get current risk status
- `POST /api/risk/check` - Check and update risk status

### Risk Management Logic
1. **Trigger**: 2 consecutive loss transactions
2. **Action**: Block new transactions for 24 hours
3. **Display**: Large Chinese warning text on homepage
4. **Reset**: Automatic after 24 hours or manual override

## Vercel KV Usage Patterns

### Data Storage Strategy
- **Transactions**: Array stored in `transactions` key
- **Risk Status**: Single object in `riskStatus` key
- **Settings**: Single object in `settings` key
- **Free Tier Limits**: 30,000 commands/month, 100KB storage

### KV Service Implementation
```typescript
// Use KVService class for all data operations
const transactions = await KVService.getTransactions();
await KVService.addTransaction(newTransaction);
const riskStatus = await KVService.getRiskStatus();
```

## Important Constraints

### Vercel Free Tier Limitations
- **Bandwidth**: 100GB/month
- **Deployment**: 100 deployments/month
- **KV Commands**: 30,000/month
- **KV Storage**: 100KB total
- **No Custom Domain**: Only *.vercel.app

### Design Decisions Based on Constraints
- Minimal data storage (no user accounts, simple JSON structure)
- Efficient API calls (batch operations where possible)
- Client-side caching to reduce KV usage
- No file uploads or large data storage

## Development Guidelines

### When Adding New Features
1. Consider Vercel KV command usage impact
2. Implement proper error handling for API routes
3. Add TypeScript types to `lib/types.ts`
4. Follow existing component patterns
5. Test with Vercel's local development server

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier for code formatting
- React functional components with hooks
- Tailwind CSS for styling

### Testing Approach
- Unit tests for utility functions
- Component tests for React components
- API route tests for backend functions
- Manual testing for risk management logic

## Deployment Checklist

### Before Deployment
- [ ] Test all API endpoints locally
- [ ] Verify KV database connection
- [ ] Check environment variables
- [ ] Test risk management 24-hour timer
- [ ] Validate statistics calculations

### Production Environment Variables
```bash
KV_URL=redis://your-kv-url
KV_REST_API_URL=https://your-kv-url.vercel.app
KV_REST_API_TOKEN=your-kv-token
```

### Post-Deployment
- [ ] Verify FoxAI logo displays correctly
- [ ] Test transaction CRUD operations
- [ ] Confirm risk alert triggers after 2 losses
- [ ] Check statistics calculations
- [ ] Monitor KV usage in Vercel dashboard