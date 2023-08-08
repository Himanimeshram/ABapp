from fastapi import APIRouter

from interface import i_apis
'''router information'''
router = APIRouter()
router.include_router(i_apis.router)
