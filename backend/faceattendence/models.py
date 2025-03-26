from django.db import models

class AdminUser(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Standard(models.Model):
    year = models.CharField(primary_key=True, max_length=50)

    def __str__(self):
        return self.year

class StudentUser(models.Model):
    roll_number = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    standard = models.ForeignKey(Standard, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.roll_number} - {self.name} - {self.standard}'

class Subject(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    professor_name = models.CharField(max_length=100, null=True, blank=True)
    standard = models.ForeignKey(Standard, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class ClassRoom(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

class Lecture(models.Model):
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    duration = models.IntegerField()
    date = models.DateField()
    students = models.ManyToManyField(StudentUser, null=True, blank=True)

    def __str__(self):
        return f"{self.subject} - {self.date}"