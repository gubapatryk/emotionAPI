from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import os
from random import randint
import uuid
from fastapi.middleware.cors import CORSMiddleware
import json

import app.detection_model as dm

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

@app.post("/images/")
async def create_upload_file(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.jpg"
    result = await dm.emotions(file)
    print(type(result))
    return result


@app.get("/images/")
async def read_random_file():

    # get a random file from the image directory
    files = os.listdir(IMAGEDIR)
    random_index = randint(0, len(files) - 1)

    path = f"{IMAGEDIR}{files[random_index]}"

    # notice you can use FileResponse now because it expects a path
    return FileResponse(path)
