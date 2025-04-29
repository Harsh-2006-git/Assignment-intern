# 🏥 Doctor Directory Web App

A modern, full-stack Node.js application for listing, adding, and filtering doctors using expressive UI and powerful backend features.
![Uploading Screenshot 2025-04-29 234020.png…]()

<br>

## ✨ Features

🔹 **Doctor Listing UI**  
View all registered doctors in a clean, responsive layout built with **EJS templates**.

🔹 **Add New Doctors**  
Form-based entry for adding doctors with fields like name, specialization, language, gender, fee, experience, and online/offline status.

🔹 **Smart Filtering**  
Apply dynamic filters such as:
- 🟢 **Availability**: Online / Offline  
- 🗣️ **Language**: Filter by spoken languages  
- 💰 **Fee Range**: Search doctors by consultation fees  
- 🚻 **Gender**: Male / Female / Other  
- 📈 **Experience**: Years of practice

🔹 **Relevance Sorting**  
Sort doctors based on most relevant matches for the filters.

<br>

## 🛠️ Tech Stack

| Layer       | Tech Used                         |
|-------------|-----------------------------------|
| **Frontend**| EJS, CSS, Icons (FontAwesome)     |
| **Backend** | Node.js, Express.js               |
| **Database**| MongoDB + Mongoose ORM            |
| **Styling** | CSS3, Flex/Grid Layout            |
| **Icons**   | Font Awesome                      |

<br>

## 📂 Project Structure

doctor-directory-app/
├── views/                  # EJS templates (frontend UI)
│   ├── partials/           # Reusable EJS components like header/footer
│   ├── index.ejs           # Main page: displays doctor listings and filters
│   └── addDoctor.ejs       # Page with form to add new doctors
│
├── public/                 # Static assets (CSS, JS, images)
│   ├── css/                # Custom styles
│   └── js/                 # Optional client-side scripts
│
├── routes/                 
│   └── doctorRoutes.js     # Express route definitions (GET/POST)
│
├── models/                 
│   └── Doctor.js           # Mongoose schema/model for doctor data
│
├── app.js                  # Main Express application file
├── .env                    # Environment variables (e.g., MongoDB URI)
└── README.md               # Project documentation
