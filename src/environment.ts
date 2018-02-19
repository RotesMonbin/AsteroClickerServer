const admin = require("firebase-admin");

const serviceAccount = {
    "type": "service_account",
    "project_id": "asteroclickerush",
    "private_key_id": "48f072be77f51b9a3d2409f686660d00616c3c6a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDaCberuL+gyc/B\nyTrFwMhPCoVEnN3dUsqU9ZbXhvP75MFvrK2lqHL0UOxbGZZjDxedTV8f2XkzuO6C\npTyYlVwNA8lYBmRrMAJ3I8rjnUb/Zc2cvWFWLGzNhqJmRI2Yf2alFc80lBBs7fyl\nx0W8Ev3CcPQVI/nYh4wX8EJlaxNMUzNL4vk0EIzW3SKpVoekx/vi4ypWBKKcwuV7\nPnkizSRjWYas6Z+QPa/wnk+/XsrAJ9tA4zID5AmYm7GRYDwxbN/xY0ZZ3JiN1M5F\ntr0TKcPrEe190aKGFWkTOhf5GLDaA4xgHOVEbzPjFhBxX/RVxxClEjI3MFf0Yma/\nJ5YT0QBPAgMBAAECggEAWlmOf50V4zXdXmrZbNqe5onwgWcTVMQa6DEAaZ0leyrm\nsTT32956jB0AZButQq0dVvSZx2Phonouc3qvKncx5r677zru36/MRbxSNZGVuv1f\nf2TGceQEzgHNR91+Y0Pfr+biruHwEINpnvR9RBsGhk0yB5SZ0o0Qk1be3JHLNGO9\n2hTgJAkuHaWd+LNCXq8ZdP+tx0Tda+Qi7WA2utWVWXMhs4pBnTSmW/mn5Y+mQpVg\n3f4/ne7jtEUmFU45Kz5pBkLoGgl+PN9Gl+KpoeY2SVVsAykw6iUlbJgQmCbY4rm+\nN4IdBN5HPwLPZd9F7/DEHFm3UESw9ry+4T6aQOqseQKBgQDvwMdIJptzQ+wq8edM\n7kCL56IFekDTbWbb2ZxIF7S0y8h+i8oUX3JGfuCeGCb8rQCaLD3ww7Ig+3fzGWXl\n0VBiDCHDC3HVmSGdqG8A/tJiSpOWdpTMXZTavh7HzuEkh5/e7FrGc7J+TKlOtlpI\nlalUwT1kt/N63JLkC94RqG83ewKBgQDo0Dog000hIFptZ84lUw3vj6EBf+CJCLbf\n7EgxtlGIEDksfbsvmy5z2tki3YxTf2c1vKMXJkkjrgiZ76CvcZBj3yEU7hSPvyum\nHcNl877RhC213U5QGTFUM10xwJ/t5FFTCeTJZB7K7693Jlajak7YrYtyk7P3pz/e\n39etFzPYPQKBgQDlIR8TNFpyIWLOdBuy6SvkyT2N8JWNukuIJwN13roD45G8Zwp8\nx+8lslImpTx1VT1zGn8j31MYtFuhiA9bQNyKp7+IcSKcmVmIHBXiJKaZ6137eV6h\npXoCR5qRKIUA7WD7onTqnl3i2I8iO6IzJl0LNBbhb/AQ5ka4DSNxSsDniwKBgQDg\nv9vNwo6L8zK4uWRdzd7/LFXPH8cAIyR/6RcMvqfYxWicVch1vcZLW7MQoHYOSUi2\nrKN4/qHOyvxMtvMVS3mLoGTMUsYQuwmFNOhkLLlCg+qozbsDQj7HvUozdHQv8KC9\nnCh8bqX3XQmz6ZPr7/2r2WVsN8CdzJyxKMCJvYN0NQKBgFiVXJfWjz2mmqnSgrhE\nedhEP58SNnpnM/amrj+j3JaIVJ7+xIM9ftIGgtaf6LfqPhbpopxcV7bFwYASyxBn\nq+AOnx+DL6hbJiw/pECOSG2HLmH6Qqf+iIvSK4eYzqwKT71a6ISlsNISs7OomAFL\nhwssvTSBEk74dHKkawRU9+7s\n-----END PRIVATE KEY-----\n",
    "client_email": "serviceaccount@asteroclickerush.iam.gserviceaccount.com",
    "client_id": "103029080389410795481",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/serviceaccount%40asteroclickerush.iam.gserviceaccount.com"
  };
  


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://asteroclickerush.firebaseio.com/"
});

export const addresses = {
    boost : '0x1129c0721a4200b3d0839e2a6079992e0b685959'
}

export const defaultDatabase = admin.database();