# 🏥 Doctor Directory Web App

A modern, full-stack Node.js application for listing, adding, and filtering doctors using expressive UI and powerful backend features.

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

doctor-directory-app/ ├── views/ # EJS templates │ ├── partials/
│ ├── index.ejs
│ └── addDoctor.ejs
├── public/ # Static files (CSS, JS, icons) ├── routes/ │ └── doctorRoutes.js
├── models/ │ └── Doctor.js
├── app.js # Express app entry └── .env # Environment variables
