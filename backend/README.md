# Face Recognition Attendance System with Geolocation

A Django-based web application for automated student attendance using face recognition and geolocation. The system uses OpenCV for face detection/recognition and stores attendance data in a MySQL database. Admins can manage users and attendance records via a web interface.

---

## Features

- **Face Recognition Attendance:** Mark attendance using webcam-based face recognition.
- **Geolocation Logging:** Capture and store the location of each attendance event.
- **Admin Dashboard:** Manage students, attendance, and users via Django admin.
- **REST API:** Endpoints for integration with frontend/mobile apps.
- **Training Pipeline:** Add new students by uploading images or extracting from video.
- **MySQL Integration:** Robust data storage for users and attendance.

---

## Project Structure

```
backend/
├── attendancesystem/         # Django project settings and URLs
├── faceattendence/           # Main app: models, views, admin, API
├── HaarCascade/              # Haar cascade XML for face detection
├── trainingImages/           # Student images for training
├── videotoimg/               # Utility to extract images from video
├── env/                      # Python virtual environment
├── faceRecognition.py        # Face recognition and attendance logic
├── trainer.py                # Script to train the face recognizer
├── trainingData.yml          # Trained model data (auto-generated)
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## Setup Instructions

### 1. Prerequisites

- Python 3.x
- MySQL Server

### 2. Clone the Repository

```sh
git clone https://github.com/yashdeep94/FaceReccognitionAttendanceSystem
cd backend
```

### 3. Create and Activate Virtual Environment

```sh
python -m venv env
env\Scripts\activate   # On Windows
# or
source env/bin/activate  # On Linux/Mac
```

### 4. Install Dependencies

```sh
pip install -r requirements.txt
```

### 5. MySQL Database Setup

- Start MySQL server.
- Create the database:

```sql
CREATE DATABASE attendence_system;
```

- Update your database credentials in `attendancesystem/settings.py`.

### 6. Django Migrations

```sh
python manage.py makemigrations
python manage.py migrate
```

### 7. Prepare Training Images

- For each student, create a folder in `trainingImages/` named with their roll number.
- Add at least 50 face images per student in their folder.
- (Optional) Use `videotoimg/videotoimg.py` to extract images from video.

### 8. Train the Face Recognition Model

```sh
python trainer.py
```

### 9. Run the Django Server

```sh
python manage.py runserver
```

### 10. Create Admin User

```sh
python manage.py createsuperuser
```

- Visit [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) to log in.

---

## Usage

- Use the web interface or API to mark attendance.
- The system uses the webcam for face recognition and logs geolocation.

---

## Key Files

- `faceRecognition.py`: Face recognition and attendance logic.
- `trainer.py`: Model training script.
- `trainingData.yml`: Generated model file.
- `HaarCascade/haarcascade_frontalface_default.xml`: Face detection model.

---

## Notes

- Activate the virtual environment before running scripts.
- For demo/testing, you can use sample images/videos.
- For production, secure your API and database credentials.

---

## License

This project uses open-source components. See `HaarCascade/haarcascade_frontalface_default.xml` for its license.

---

**Contributors:**  
- Yash Darekar
