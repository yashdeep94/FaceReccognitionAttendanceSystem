# First install following packages
1. Python
2. Mysql

# After installing above packages in mysql database create database called attendence_system using command below
create database attendence_system;

# After that install all the python packages in virtual environment which are listed in requirements.txt file by using below command
pip install -r requirements.txt

# For training image data for each student user follow below steps
1. Open trainingImages folder
2. In that folder create a new folder
3. Folder name should be given as student roll number as entered in database
4. In that roll number folder put students photos minimum 50 photos which will be used for training classifier
5. Then come back to the trainer.py file directory and start virtual environment there with cmd and run that trainer.py file with command `python trainer.py` and wait until it traines model
6. After trainer.py finished executing it will generate trainingData.yml file which is our trained model which we will use for face detection and recognition.
And You are done with training model

# After all above is done you can start django python server and create admin user by running provided script file which is create_user.py file you can run it as follows
1. Start virtual environment with command `env\Scripts\activate`
2. Start python server with command `python manage.py runserver` before running make sure you have migrated database and run its command
3. Go to 'server_ip/admin/' login there and go to admin user and click add to create admin user and enter details as follows (first time only) -
name - admin
password - e1c3fd75a7a636035713c3dfb32c0b0794ce5b8365a98abdd0a4de45dde8b3b6
after this click save and now you can go to frontend and use the webapp

# After this you can run frontend server and and login to admin panel and create users and start using webapp