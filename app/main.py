from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import os
from random import randint
import uuid
from fastapi.middleware.cors import CORSMiddleware

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
    contents = await file.read()  # <-- Important!

    # example of how you can save the file
    with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)

    return {"score": {
            "happy" : 90,
            "sad" : 10,
            "confused" : 30
            },
            "arrows": [
                [100,100,200,200],
                [150,120,150,100]
            ]
        }


@app.get("/images/")
async def read_random_file():

    # get a random file from the image directory
    files = os.listdir(IMAGEDIR)
    random_index = randint(0, len(files) - 1)

    path = f"{IMAGEDIR}{files[random_index]}"

    # notice you can use FileResponse now because it expects a path
    return FileResponse(path)
