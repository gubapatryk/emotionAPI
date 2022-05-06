import json

from app.detection import AzureRequestSender

EMOTION_PARAMS = {
    'returnFaceId': 'false',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'headPose,blur,emotion'
}

EMOTIONS_DETECTION_MODEL = AzureRequestSender(params=EMOTION_PARAMS)


async def detect_emotion(img):
    res = await EMOTIONS_DETECTION_MODEL.detect_face(img)
    return res


async def emotions(file):
    if not file:
        return json.dumps({"error": "Please try again. The Image doesn't exist"})
    try:
        response_json = await detect_emotion(file)
        face_emotions = response_json["faceAttributes"]["emotion"]
        face_rectangle = response_json["faceRectangle"]
        return face_emotions
    except Exception as e:
        return json.dumps(f'"error": "{e}"')
