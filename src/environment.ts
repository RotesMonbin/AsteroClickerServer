const admin = require("firebase-admin");

const serviceAccount = {
    "type": "service_account",
    "project_id": "asteroclicker",
    "private_key_id": "ce28ff07e1cdba7a8cf6681e659008613ebd9c5a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2UP42m5rDh16q\n8gJddMQp3BGvEbaUaT1fqgGTzhJ/LX4qR8zHcJmOim0cdOnBlFmubHMX6Ugy18kp\ntmj4yeWLlko/ra4S2p2nR6becMymKrnRN2bvVhG6OrpCEWO3lQftWwoUIyGIjrXc\nNGIYQ5y03kBtvincEdd5Z826+DH/SGSoBwG5MbdUv7hjanERcrdJXFvS0LP70KUs\npTn7lm+yUr52IU3ZXw2j4zuENcHY/1tRillmbqdPRgHz/d7aLQ8ctHodNTThkM0/\nkbQ40nC1V7S6sQK6Cn8zk4l87BZeJ2cGvTEZg2Tn1nJ35S4+3ZiRL04gnM/tiQEr\n0ULpk6InAgMBAAECggEAKcRoWM5RKFZM49DJpetoPUbDbl4ae+mYO+BQuDHPnv8n\nFjyYt2Aebb9cu9Y07zozSXhi7alt9ufkl//IEKcARXhKzkfVx0/6KiaKHg+tcqv7\nIekVVeNb8FQf857UP2yPAluG9ZIOzqATHb2Kc5CZx/3auMmGAXq86H1Vbm4J1je2\negHU7qKb9fAO1GlxIXeCD6rzVKH4u6dTQYlX5hoRDpk9qfyaZ8pGkqbtbctvnAGt\nm0QSbFyilf5jIX+Wj8Dj2XTgRa7S8EMsyidxWWXPPBrXIY2pGEowBAHqjdAA2y+m\nSJ6CfAXkyxzw+mAEWXflbTYXJULnQMaYrfzAfwL8wQKBgQDgEeJwt/y3QJ9FmFSz\nI5OmiYAMD1V3aUhBFHFHdwiI+krj8EgFpP8dweHnKLH7xXGe26eJqd6sHKfc6NlG\nq5XRuqPvujmoEyfKpwL9pucBVVpCoKLejgYtVS4lBKHot+QbOmjxSHOlGOPpv19/\nSi4FQSJdKVfR9ZRrQATcILDWMQKBgQDQS+7Ft7niOwCM6DP2sVSNm+84jC4/CLpE\nF7ccgZaLE6gGHiQ7ACdbQK3zMKJoNFZcpzyA9GcTzuwmV2G0DdzZBDR0PshAMh79\n73puZZogVEIAtSKoyyWQRWr5vJ6i532M7W2aG7zEMLiPWR+SN44BGcTpreHZp+v3\nnKiWMJjv1wKBgGn968h4L/Ibfnv0T/ShWqHHnyuVQU+IHOa0HdW5Z+8rvqtOKTOK\nViekZBDtviujvVhw/TJwiWWO9JTaDJWSav9Xs16eD9ICpasGD7Me9V07G8Qyqnhu\nZFujVH2sUE5+VkfO/H9OT24EdSNIJItY8qYHppK9EM6/xWJqWSIr0JqxAoGBALM3\nEdpVyH5Ia6HQy5zOWER6zOlnWwbq+HBLw0WojaFdqSySVHPbHwGZddEOoD1uAnw3\ne4wsPF/DolUey7aCUuj5gDQgLGVneljb6ggALQrx09QOBSMbnlcyEueKjSb2a4SM\nZ8e3Y8Odc74KXWqNmAWEaXLxI6gEnbbut/J5H60DAoGAdc8ts7TQNgtdDw8iijkv\nz0F0gRy4H3HN3HDCNrkHRbhng2jZvNTd3i1qD15w2KNCP6vJohTd/Y5RsW2IuBCT\n8cgppuVQBCdo6g12O+riXbRhmPjcM9oOEhsJAwCxjknRucanQB8y2MSjNiLjeueu\ntOJASQBJIe8M/1Mtu2bOhUc=\n-----END PRIVATE KEY-----\n",
    "client_email": "asteroadmin@asteroclicker.iam.gserviceaccount.com",
    "client_id": "104181626588928906233",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/asteroadmin%40asteroclicker.iam.gserviceaccount.com"
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://asteroclicker.firebaseio.com"
});

export const defaultDatabase = admin.database();