from django.core import serializers
from .models import *
from django.http import JsonResponse, HttpResponse, FileResponse
from json import dumps, loads, load
import jwt, hashlib
from datetime import datetime
import base64, cv2
import faceRecognition as fr
import numpy as np

SECRET_KEY = "beproject"
SALT = "be"

# Route 1: /api/auth/createadminuser/ [POST] Creating Admin User (No Login Requires)
def create_admin_user(request):
    if request.method == "POST":
        data = loads(request.body)
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            # Validating incoming data
            if len(data.get('name')) == 0 or len(data.get('password')) == 0:
                return HttpResponse("Username or password cannot be blank", content_type="text/plain", status=400)
            elif len(data.get('name')) > 100:
                return HttpResponse("Name should be less than 100 characters", content_type="text/plain", status=400)
            elif len(data.get('password')) > 15:
                return HttpResponse("Password should be less than 15 characters", content_type="text/plain", status=400)
            else:
                # checking user in database and storing it
                if AdminUser.objects.filter(name=data.get('name')).exists():
                    return HttpResponse("Some error occured", content_type="text/plain", status=400)
                else:
                    encoded_password = hashlib.sha256(bytes(data.get('password') + SALT, "UTF-8")).hexdigest()
                    user_object = AdminUser(name=data.get('name'), password=encoded_password)
                    user_object.save()
                    return HttpResponse("Admin User Created Successfullly", content_type="text/plain")
        except Exception as e:
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 2: /api/studentuser/ [GET] Get All Student User (Login Requires) 
#                            [POST] Creating Student User (No Login Requires)
def student_user(request):
    if request.method == "GET":
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            # Getting all student queryset and converting it to the json
            student_data = serializers.serialize("json", StudentUser.objects.all(), fields=("roll_number", "name", "standard"))
            return JsonResponse(student_data, safe=False)
        except Exception as e:
            print(f"Error in student - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    elif request.method == "POST":
        data = loads(request.body)
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            # Validating incoming data
            if len(data.get('name')) == 0 or len(data.get('password')) == 0 or len(data.get('rollNumber') or len(data.get('standard'))) == 0:
                return HttpResponse("Username or password or roll number ot standard cannot be blank", content_type="text/plain", status=400)
            elif len(data.get('name')) > 100:
                return HttpResponse("Name should be less than 100 characters", content_type="text/plain", status=400)
            elif len(data.get('password')) > 15:
                return HttpResponse("Password should be less than 15 characters", content_type="text/plain", status=400)
            else:
                if AdminUser.objects.filter(name=user_data.get('name')).exists():
                    # checking user in database and storing it
                    if StudentUser.objects.filter(roll_number=data.get('rollNumber')).exists():
                        return HttpResponse("Some error occured", content_type="text/plain", status=400)
                    else:
                        encoded_password = hashlib.sha256(bytes(data.get('password') + SALT, "UTF-8")).hexdigest()
                        user_object = StudentUser(name=data.get('name'), password=encoded_password, roll_number=data.get('rollNumber'), standard=Standard.objects.get(year=data.get('standard')))
                        user_object.save()
                        return HttpResponse("Student User Created Successfullly", content_type="text/plain")
                else:
                    return HttpResponse("Not Authenticated", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in student user - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 3: /api/auth/adminlogin/ [POST] Login Admin (No Login Requires)
def admin_user_login(request):
    if request.method == "POST":
        data = loads(request.body)
        try:
            # Validating data
            if data.get('password') == "" or data.get('name') == "":
                return HttpResponse("Name or Password cannot be blank", content_type="text/plain", status=400)
            else:
                # Checking user in database and if there then returning jwt token
                user_object = AdminUser.objects.filter(name=data.get('name'))
                if user_object.exists():
                    encoded_password = hashlib.sha256(bytes(data.get('password') + SALT, "UTF-8")).hexdigest()
                    if user_object[0].password == encoded_password:
                        payload = data
                        encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
                        return JsonResponse({"authToken" : encoded_jwt, "userName" : user_object[0].name})
                return HttpResponse("Some error occured check your credentials", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in admin user login - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 4: /api/auth/studentlogin/ [POST] Login Student (No Login Requires)
def student_user_login(request):
    if request.method == "POST":
        data = loads(request.body)
        try:
            # Validating data
            if data.get('password') == "" or data.get('rollNumber') == "":
                return HttpResponse("Roll Number or Password cannot be blank", content_type="text/plain", status=400)
            else:
                # Checking user in database and if there then returning jwt token
                user_object = StudentUser.objects.filter(roll_number=data.get('rollNumber'))
                if user_object.exists():
                    encoded_password = hashlib.sha256(bytes(data.get('password') + SALT, "UTF-8")).hexdigest()
                    if user_object[0].password == encoded_password:
                        payload = data
                        encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
                        return JsonResponse({"authToken" : encoded_jwt, "userName" : user_object[0].name})
                return HttpResponse("Some error occured check your credentials", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in student user login - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 5: api/subject/ [GET] Get All Subject (Login Requires)
#                       [POST] Add Subject (Login Requires)
def subject(request):
    if request.method == "GET":
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            # Getting all subject queryset and converting it to the json
            subject_data = serializers.serialize("json", Subject.objects.all())
            return JsonResponse(subject_data, safe=False)
        except Exception as e:
            print(f"Error in subject - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    elif request.method == "POST":
        try:
            data = loads(request.body)
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            if AdminUser.objects.filter(name=user_data.get('name')).exists():
                # Adding data to database
                if not (data.get("name") == "") and not (data.get("standard") == ""):
                    new_obj = Subject(name=data.get("name"), professor_name=data.get("professor"), standard=Standard.objects.get(year=data.get("standard")))
                    new_obj.save()
                    return HttpResponse("Subject Added Successfullly", content_type="text/plain")
                else:
                    return HttpResponse("Bad Request", content_type="text/plain", status=400)
            else:
                return HttpResponse("Not Authenticated", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in subject - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 5: api/classroom/ [GET] Get All classroom (Login Requires)
#                         [GET] Get Selected Classroom (Login Requires)
#                         [POST] Add Classroom (Login Requires)
def classroom(request):
    if request.method == "GET":
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            if request.GET.get("classroom"):
                # Getting selected classroom queryset and converting it to the json
                return JsonResponse({
                    "latitude":ClassRoom.objects.get(name=request.GET.get("classroom")).latitude,
                    "longitude":ClassRoom.objects.get(name=request.GET.get("classroom")).longitude
                    }, safe=False)
            else:
                # Getting all classroom queryset and converting it to the json
                classroom_data = serializers.serialize("json", ClassRoom.objects.all())
                return JsonResponse(classroom_data, safe=False)
        except Exception as e:
            print(f"Error in classroom - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    elif request.method == "POST":
        try:
            data = loads(request.body)
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            if AdminUser.objects.filter(name=user_data.get('name')).exists():
                # Adding data to database
                if not data.get("name") == "":
                    new_obj = ClassRoom(name=data.get("name"), latitude=data.get("latitude"), longitude=data.get("longitude"))
                    new_obj.save()
                    return HttpResponse("Classroom Added Successfullly", content_type="text/plain")
                else:
                    return HttpResponse("Bad Request", content_type="text/plain", status=400)
            else:
                return HttpResponse("Not Authenticated", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in classroom - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 6: api/lecture/ [GET] Get lectures by specified date (Login Requires)
#                       [GET] Get All lectures (Login Requires)
#                       [POST] Add Lectures (Admin Login Requires)
#                       [PUT] Update Lecture (Lohgin Requires)
def lecture(request):
    if request.method == "GET":
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            # Getting all lecture queryset and converting it to the json
            if request.GET.get("date"):
                lecture_data = serializers.serialize("json", Lecture.objects.filter(date=datetime.strptime(request.GET.get("date"), "%Y-%m-%d"), subject__standard=StudentUser.objects.get(roll_number=user_data.get("rollNumber")).standard).exclude(students__in=[StudentUser.objects.get(roll_number=user_data.get("rollNumber"))]), fields=("classroom", "subject", "duration"))
                return JsonResponse(lecture_data, safe=False)
            elif request.GET.get("admindate"):
                lecture_data = serializers.serialize("json", Lecture.objects.filter(date=datetime.strptime(request.GET.get("admindate"), "%Y-%m-%d")), fields=("classroom", "subject", "duration", "students", "date"))
                return JsonResponse(lecture_data, safe=False)
            else:
                lecture_data = serializers.serialize("json", Lecture.objects.all(), fields=("classroom", "subject", "duration", "date"))
                return JsonResponse(lecture_data, safe=False)
        except Exception as e:
            print(f"Error in lecture - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    elif request.method == "POST":
        try:
            data = loads(request.body)
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            if AdminUser.objects.filter(name=user_data.get('name')).exists():
                # Adding data to database
                if not data.get("name") == "":
                    new_obj = Lecture(classroom=ClassRoom.objects.get(name=data.get("classroom")), subject=Subject.objects.get(name=data.get("subject")), duration=int(data.get("duration")), date=datetime.strptime(data.get("date"), "%Y-%m-%d"))
                    new_obj.save()
                    return HttpResponse("Lecture Added Successfullly", content_type="text/plain")
                else:
                    return HttpResponse("Bad Request", content_type="text/plain", status=400)
            else:
                return HttpResponse("Not Authenticated", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in lecture - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    elif request.method == "PUT":
        try:
            data = loads(request.body)
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            if data.get("pk"):
                Lecture.objects.get(id=data.get("pk")).students.add(StudentUser.objects.get(roll_number=user_data.get("rollNumber")))
                return HttpResponse("Student Attended Lecture Successfullly", content_type="text/plain")
            else:
                return HttpResponse("Bad Request", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in lecture - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 7: api/standard/ [GET] Get All standard (Login Requires)
#                        [POST] Add Standard (Login Requiires)
def standard(request):
    if request.method == "GET":
        try:
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            # Getting all standard queryset and converting it to the json
            standard_data = serializers.serialize("json", Standard.objects.all())
            return JsonResponse(standard_data, safe=False)
        except Exception as e:
            print(f"Error in standard - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    elif request.method == "POST":
        try:
            data = loads(request.body)
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            if AdminUser.objects.filter(name=user_data.get('name')).exists():
                # Adding data to database
                if not data.get("standard") == "":
                    new_obj = Standard(year=data.get("standard"))
                    new_obj.save()
                    return HttpResponse("Standard Added Successfullly", content_type="text/plain")
                else:
                    return HttpResponse("Bad Request", content_type="text/plain", status=400)
            else:
                return HttpResponse("Not Authenticated", content_type="text/plain", status=400)
        except Exception as e:
            print(f"Error in standard - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)

# Route 8: api/recognizeFace/ [POST] Recognize Face (Login Requiires)
def recognize_face(request):
    if request.method == "POST":
        try:
            data = loads(request.body)
            # Authenticate user
            encoded_jwt = request.headers.get("Auth-Token")
            user_data = jwt.decode(encoded_jwt, SECRET_KEY, algorithms=["HS256"])
            image = base64.b64decode(data.get("image"))

            face_recognizer = cv2.face.LBPHFaceRecognizer_create()
            #Load saved training data
            face_recognizer.read('trainingData.yml')

            nparr = np.frombuffer(image, np.uint8)
            cap=cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            faces_detected,gray_img=fr.faceDetection(cap)

            if not len(faces_detected) == 0:
                for face in faces_detected:
                    (x,y,w,h)=face
                    roi_gray=gray_img[y:y+w,x:x+h]
                    label,confidence=face_recognizer.predict(roi_gray)
                    # print("confidence:",confidence)
                    # print("label:",label)
                    if label == int(user_data.get('rollNumber')):
                        return JsonResponse({"faceDetected":True, "recognized":True})
                    else:
                        return JsonResponse({"faceDetected":True, "recognized":False})
            else:
                return JsonResponse({"faceDetected":False, "recognized":False})
        except Exception as e:
            print(f"Error in recognize face - {e}")
            return HttpResponse("Some error occured", content_type="text/plain", status=500)
    else:
        return HttpResponse("Bad Request", content_type="text/plain", status=400)