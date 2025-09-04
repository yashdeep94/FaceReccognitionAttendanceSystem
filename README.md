# Face Recognition Attendance System

A full-stack web application for automated attendance using face recognition and geolocation. The project is split into two main parts:

- **Frontend:** Modern React.js app for user interaction and attendance marking.
- **Backend:** Django-based REST API with face recognition, geolocation, and MySQL integration.

---

## Project Structure

```
FaceReccognitionAttendanceSystem/
├── backend/      # Django backend (API, face recognition, DB)
├── frontend/     # React frontend (UI, API integration)
└── README.md     # Project overview (this file)
```

- Each folder contains its own `README.md` with detailed setup and usage instructions.

---

## Features

- Face recognition-based attendance (OpenCV)
- Geolocation verification to prevent proxy attendance
- Admin dashboard for managing users, classes, and attendance
- REST API for frontend/mobile integration
- MySQL database for robust data storage

---

## Quick Start

### 1. Backend

- Python 3.x, MySQL required
- See `backend/README.md` for setup, training, and running the Django server

### 2. Frontend

- Node.js and npm/yarn required
- See `frontend/face-attendence/README.md` for setup and running the React app

---

## Requirements

- **Backend:** Django, OpenCV, MySQL, etc. (see `backend/requirements.txt`)
- **Frontend:** React, modern browser

---

## Contributing

Contributions are welcome! Please see the frontend and backend READMEs for details.

---

## License

See individual component folders for license details.

---

**Authors:**  
- Yash Darekar

---

Let me know if you want to add project screenshots, API documentation, or deployment instructions!
