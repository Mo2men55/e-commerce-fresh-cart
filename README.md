# E-Commerce (Fresh Cart)

**E-Commerce (Fresh Cart)** is a full-featured online storefront built with **Next.js**, **TypeScript**, and **Tailwind CSS**, powered by the Route E-Commerce API.

Shop products by category and brand, manage your cart and wishlist, check out securely, track orders, and manage your account — all in a responsive shopping experience.

![FreshCart preview](./assets/images/FireShot%20Capture%20001%20-%20Final%20-%20localhost.png)

## Features

- **Product catalog** — browse, search, and view product details
- **Categories & brands** — shop by category or brand
- **Cart & wishlist** — add, update, and manage items
- **Checkout & orders** — place orders and review order history
- **Authentication** — sign up, log in, and password recovery with NextAuth
- **User profile** — manage account details
- **Responsive UI** — mobile-friendly layout with Heroicons & Headless UI

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Auth | NextAuth.js |
| Data fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| API | [Route E-Commerce API](https://ecommerce.routemisr.com) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment variables

Create a `.env.local` file in the project root:

```env
BASE_API=https://ecommerce.routemisr.com
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

> Generate a secret with: `openssl rand -base64 32`

`BASE_API` is optional and defaults to `https://ecommerce.routemisr.com`, so no API
environment variable is required on Vercel. Set `BASE_API` only if you want to use
a different API URL.

## Project structure

```
app/
├── (Auth)/          # Login & Sign up
├── _component/      # UI components & server actions
├── api/             # API routes (auth, cart)
├── cart/            # Shopping cart
├── checkOut/        # Checkout flow
├── orders/          # Order history
├── products/        # Product listing
├── productDetails/  # Product detail pages
├── wishlist/        # Wishlist
└── ...
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

## License

This project was built as part of the Route Academy frontend track.
