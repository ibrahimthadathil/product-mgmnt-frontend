
---

---

## 📌 **FRONTEND README.md**

```md
# 💻 Product Management Frontend (Next.js + TypeScript)

This is the frontend of the Full Stack Product Management System.  
It includes secure authentication, product management UI, animated previews, a persistent cart system, and reusable hooks/components.

---

## 🌍 Live Site

🔗 https://product-mgmnt-frontend.vercel.app  

---

## 🧰 Tech Stack

| Feature | Library |
|---------|---------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| UI | ShadCN + TailwindCSS |
| State & Server Sync | React Query |
| Forms | React Hook Form + Zod |
| Table | TanStack Table |
| Auth | NextAuth |
| Animations | Framer Motion |
| Deployment | Vercel |
| State Store (Bonus) | Zustand |

---

## 📂 Project Structure

src/
├── app/
├── components/
├── hooks/ ← reusable custom hooks
├── lib/
├── services/
├── types/
├── provider/
├── schema/
├── const/
├── store/ ← Zustand (optional)



---

## 🔐 Authentication

- NextAuth with Credentials Provider & session sync
- Protected pages & conditionally rendered actions
- Token forwarded using Axios interceptor

---

## 🛍 Features Implemented

- Login Page
- Product List with:
  - Grid view
  - Table view (pagination + sorting + search)
- Create Product
- Edit Product
- View Product modal with animations
- Image upload + preview (min 3)
- Cart with:
  - Add / Remove / Increase / Decrease
  - Persistent state based on logged-in user

---

## ⚙️ Setup

```bash
git clone <frontend-repo-url>
cd frontend
npm install
