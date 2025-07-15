# 🎫 Ticket Management System

A full-stack Ticket Management System built with **Next.js**, **Prisma**, **NeonDB**, and **Sentry** for error monitoring. Users can register, log in, create, and close support tickets securely.

📡 **Track errors in real time using [Sentry](https://sentry.io)** — get notified instantly when something breaks in production.

## 🚀 Live Demo

🔗 [https://ticket-managemet-system-next-js.vercel.app/](https://ticket-managemet-system-next-js.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Server Actions
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: JWT + HTTP-only cookies
- **Error Monitoring**: Sentry (📡 real-time error tracking)
- **Hosting**: Vercel

...


---

## 🧑‍💻 Features

- ✅ User registration & login (secure with JWT)
- ✅ Form validation & feedback
- ✅ Authenticated ticket creation
- ✅ Ticket listing & filtering
- ✅ Ticket closing flow
- ✅ Integrated error/event logging with Sentry
- ✅ Secure cookie-based session management

---


---

## 🧪 Running Locally

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your NeonDB and AUTH_SECRET values

# Push Prisma schema
npx prisma generate
npx prisma db push

# Run dev server
npm run dev
```


# 🤝 Contributing Guidelines

Thanks for taking the time to contribute to the Ticket Management System!

## 🛠 How to Contribute

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourname/yourrepo.git`
3. Create your feature branch: `git checkout -b feature/some-feature`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature/some-feature`
6. Submit a Pull Request

---

## 💡 Suggestions

We welcome bug reports, feature requests, and performance improvements. Please open an issue and describe the problem clearly.



