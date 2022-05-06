import json

from app.detection import AzureRequestSender

COMPARISON_PARAMS = {'returnFaceId': 'true',
                     'returnFaceLandmarks': 'false',
                     'returnFaceAttributes': 'headPose,blur'}

COMPARISON_DETECTION_MODEL = AzureRequestSender(params=COMPARISON_PARAMS)

async def detect_id(img):
    res = await COMPARISON_DETECTION_MODEL.detect_face(img)
    return res

async def compare_faces(file_actor, file_user):
    if not file_user or not file_actor:
        return json.dumps(f'"error": "Please try again. The Image doesnt exist"')
    try:
        user = await detect_id(file_user)
        actor = await detect_id(file_actor)
        user = user["faceId"]
        actor = actor["faceId"]
        comparison_results = COMPARISON_DETECTION_MODEL.compare_faces(user, actor)
        return comparison_results
    except Exception as e:
        return json.dumps(f'"error": "{e}"')
