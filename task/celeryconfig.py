from cloudr.config import REDIS_URL

broker_url = REDIS_URL
result_backend = REDIS_URL

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
