const admin = require("firebase-admin");

const serviceAccount = {
    "type": "service_account",
    "project_id": "asteroclicker-e39c7",
    "private_key_id": "415c385729eb401d914eacc5e6c0a536bf58c73a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCV2AOUyUNR3SPq\nfEG9Iv8hAAmY69EB2GP2N4Rb+89io3Gx+xsBxuXBukHFWRpVM3AL+4vjK6b1AuBN\nYhBYq++r784CvmJsCbMJ5ORnAmrvDweqoo/9bbyK/0rJ5i53VSLPJEzIgC1hOX0S\nD9iz47Jf4H7Bo+dpkCpNl1l1teiAPCZwxfDJOTy6czBIgYKdUprFcXntgaZDq8+P\neWQHasVJtzjIh10PsJCEGibJ24cY9ZcWrAZbkncYXBwj5veOFwvZh4hBs76VjHL7\nx4ZxOALenx29yfm5eYHSkJtJwrpMLWKFel/7+uoHHDtE6WZVJ6YWvIPwBjFR+K7L\nHe7XgNEPAgMBAAECggEAKLrczlaeu+PWXWiFHfojSz8NXMnMuCmvkj+o9K/PwUoY\nH37X6nW8Ahq0wgXkSICA1mD7tzYoXbT4b1BWjSO/NActAkXpzuAcEHZtNyrLEkwN\nk244oXRwqX+XPqYYv0se+Rsu29krfJ/5xS0VhGBCHhmRmuUIhAMx3IFlSb+2gRRu\nC+RUm1H7qW8h9Ev0Iu2x0nDNLjq8T4+Qfbjunu8/c8K6xhk9cvQZBaSzbsPMAdxF\nE/goAUe0yc7wnYTvA4066EHm6sPAfTHb5H1fEm7SjIicN1iWHZ6wMwVbtXCuFrCA\nCG3NZTEm7Eeunac94ilra+EuD7QpofcUkzSGzRpfQQKBgQDFW6uWEvtLVsc6RKDC\n3+lPl6jM59vAya24RndPwgbxZnpaClE1UY9nYcaTysJgbqyOuiysgF4YiUCMtjHl\nPrJp3KqVEpuMh5BVbwZQ6pp5NRpmKvub/62mhkYWy/9BuhI+gcDcKnq6pgnLE4zV\n5QwIfQtZJ78Ck0FcuHEN/btGnwKBgQDCXhnNFD8qKXzVdZST9DlBhRAL2p+QxXDM\nG5rdHj75wR57krm9dD3nCFHG2ozaXJB/x0/Ixw+bq5gl+DgChiu31q7NlKDfLfC3\n24urin866337FnWIuFGmj8hHk6FVOlI6Rpu9xorYtALY9wS8rfgu9LUiYIwHIy+Y\ng50DUSWPkQKBgQC89x79nMMbycUMV3WN4ZKk8NNhDodsui4piN7ocSDwtmxkFgjX\ngnZKSGY4UCV4678xEbWAnZB68b/qevCfTT7K+cwi3CQvlAVwp9NmWpr5fwz90h4D\nqfV8wogNf9mx9xVM4DPnGo1UdXJfDSMGEj9JSWE6RkIvlws4Wil1egJ8hQKBgQCu\nTRrQKQ737VqQRjAmekX6NqyMJNMhTZ34u+ylzGDnMkL2yD6e4iY9D93d+NGFZKsE\nm6U1xSV/EWOQ8UaxJMcBxpjdrSKS4azUBCL9g2bTXKmOSLbAE6LNPnV5kq+EMZfZ\nwMYbanfLG6rODL8HwO8mlLX3DSOlpu0g1S4x8kw/sQKBgQC4Fo6oOGXsyNUQ7FhV\nEkFgvt5n+SmfpQ1QAcyb+4t/RoZeUnClPRsJugPotguNAQMzCGLM0n6emrjw83s2\nL9k1t4yWRKx8NkNvQvRh8tHK49BR6PLfU61NzRK/SX3VDdXdYEZZvPOzKUBy/d9j\n9chljMiLtOrjAEhLshfjXIB3zg==\n-----END PRIVATE KEY-----\n",
    "client_email": "asteroclickerservice@asteroclicker-e39c7.iam.gserviceaccount.com",
    "client_id": "116290755699894765505",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/asteroclickerservice%40asteroclicker-e39c7.iam.gserviceaccount.com"
  };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://asteroclicker-e39c7.firebaseio.com/"
});

export const defaultDatabase = admin.database();