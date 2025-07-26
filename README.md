# 🍔 **MunchQuest**

**MunchQuest** is a modern full-stack restaurant review and discovery platform. Users can explore restaurants, leave reviews, manage menus, and more. Built for both everyday foodies and admins with full CRUD control.

🌐 **Live Site**: [https://munchquest.vercel.app](https://munchquest.vercel.app)

---

## ✨ **Features**

* 🔍 Browse restaurants with ratings and images
* 📝 Leave reviews with star ratings
* 🧑‍💻 Admin and owner controls for adding, editing, or deleting restaurants
* 🧾 Menu editing support for restaurant owners and admins, enabling a fully customizable and dynamic menu experience per restaurant. 
* 📬 Notifications for owners on new reservations
* 🪪 Dedicated profile pages with user-specific info
* 📅 Table reservation system allowing users to reserve seats directly from the restaurant page
* 📱 Responsive UI optimized for mobile and desktop
* 🧠 Real-time UI feedback with loading spinners and toast notifications
* 🔐 Authentication via Firebase

---

## 🛠️ **Tech Stack**

### 🔹 Frontend

* React
* TailwindCSS
* Axios
* Vite

### 🔹 Backend

* Express.js
* MongoDB (Mongoose)
* Cloudinary (image hosting)
* Firebase Admin SDK (custom claims)
* Method-Override (for PATCH/DELETE via forms)

### 🔹 Deployment

* **Frontend**: Vercel
* **Backend**: Render
* **Database**: MongoDB Atlas

---

## 🧭 **Project Structure**

```
/
├── fe/              → Frontend (React)
├── be/              → Backend (Express, Mongoose)
├── public/          → Static assets (logo, icons)
├── .env             → Environment variables
├── vercel.json      → Vercel config
└── README.md        → This file
```

---

## 🌱 **Future Enhancements**

* 🔍 Option to filter restaurants
* 🖼️ Cloudinary integration for seamless image uploading and optimization
* 📊 More robust admin dashboard
* ⏳ Pagination and infinite scroll for reviews
* 🎨 UI polish and accessibility improvements
