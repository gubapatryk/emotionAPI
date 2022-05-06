from fastapi import FastAPI, File, UploadFile
import os
from fastapi.middleware.cors import CORSMiddleware
import app.emotion_detection as ed
import app.face_comparison as fc

IMAGEDIR = "/fastapi-images/"
os.mkdir(IMAGEDIR)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/emotions/")
async def analyze_emotions(image_file: UploadFile = File(...)):
    result = await ed.emotions(image_file)
    print("result of emotion detection", result)
    return result

@app.post("/compare/")
async def compare_faces(actor_face_file: UploadFile = File(...), user_face_file: UploadFile = File(...)):
    result = await fc.compare_faces(actor_face_file, user_face_file)
    print("result of comparison", result)
    return result
