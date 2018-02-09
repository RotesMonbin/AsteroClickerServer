const admin = require("firebase-admin");

const serviceAccount = {
    "type": "service_account",
    "project_id": "asteroclicker5",
    "private_key_id": "882c2518348d0151672e9bc2b79c7bbfb9e70b74",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxBpSFQGrMCXTH\ngLIz9Eh0qJMjxncS+rS0dSb/Ts0aB41MGcTPz+eJPi8+EjRGD7Y3tenrXhmfqW9H\n52lwWVbKjM4HjB6qg+thh/HHGnPuWc6ts7j7NolB70Hbhwu0gOlwjYJkKvwWC2WO\nResO13MCrMxunVPtyJQnN0GqrjIBL6P1o7NFa3X/R0qr9Ppw3Mr4Alm3ihmQTVdB\nHC4yd3Q4aFr57e7888k2Blt+OYHFOi29xRI0QHf/hrCLbP8C5rQhSlenEdxA/L+9\n7/lTgfwxQLo8E4qld5B/YqVrJi1v5nd7V/nBcavxt+BxiG/Hl1dtab7fgVSJwJkd\n8zE1fmu3AgMBAAECggEAV/BY30j8xJb9+A0qeTyksa78SQ1SIY+BLRP1Z2aR5JhT\nzLYQWtuAvWCyvzbz2Mn9TveDWHTKbdIRgbqnWjRHNR91SbKFmVcnGrAZnzq41HKw\nhQF+puyUirh8Er2nRuezD0J8v53K1Hic3mxFNH46l92XQGvPQZQeZMzCRjN6i7N1\nzA0yOZE/MlSc1J8dWPEGwB8hr4te/SoxBzrMpVsk771gVukwLfl1A4rcR5cLQIzG\nLvPF55egdrBnv5O1AYruGm0TUpYAE2+J2mGgoaxuvrfKAZL1NPpLNnsncJVK08Ny\nGj1nus//LsFiHSO07ZgrsFutSuwNRYjXQG7qyUWioQKBgQDwBwFqkU8rVlNTvSB1\nx/h+cMtVPNNfSS0FwZ0o/fzdAYks6J/ng4w+/u/a83jXmehgpYFUc9kGcSIEB8Wo\nW0Cvtb7tMohyvebZF9YazIyDPZcRWaryxCdcBdHvaTyi+SlX9dlea54noJRGWVBm\njJZPIPa4ettMkly9V4Q6litn/QKBgQC8zk7BzyooGI0uYDBg3X6s1GsfKY4yFHoR\nwxdRstxUgqAFTTYx0TWxrnR0getjPqnJWp25Eetj+0dG83mhyZZbMItW1LYOINv8\nJd6GNhVk/EridwzaX5JRmD7KfFrfWTeux2S8jGZzsBe8tH87AtnUzhsJXF2fp3M7\nqrSzsBXuwwKBgBGVYcwtwu/4zffndfZK5PBWUP74ir+DO9IdIec73AdQsnzgub4b\nC+4dfPK8PVEGDFjwJu5J4k8vgH9tFlTEApQcq1TzC73kHYIv1dZ2v6BppaR2vig0\nqHF8V6nDOtbxi87OytK47YgXomUY6+PnTqeTUZ+oGGKeoj6Yp64nDBz9AoGAP7p/\nWOm9OAV5egLbsYZx4JJeigkzxvGkdmRcdaYiup/QtZlnRo9wSUYyZrUHp9sZ4i4k\n+Lf0tS221FsQXiy2BJexIKDxxnkO5+A8aR7OP+Tsvd4jR35k3AfAggZRgfwSUHtb\nJE1bs4bnrDlcjKWcszjSZWl47I/P1H79OX2hGZMCgYAr+JHVaLd3YRyF/373XLNh\nIzG3KC6D7JpyuiCRYXxiAj1tG3Ij9dmMijd92bcF1yIZd+SrDh2WxJV2nI0EE+lO\nyPsxAr1/IVdM1jJPsDOhlZWckUWJQc8Ni+cAicUuJRubyIR2lk37VsuLwAUPXk+/\ndQB87syWICh62cmXNs3l+Q==\n-----END PRIVATE KEY-----\n",
    "client_email": "serviceaccount@asteroclicker5.iam.gserviceaccount.com",
    "client_id": "106368488204607440247",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/serviceaccount%40asteroclicker5.iam.gserviceaccount.com"
  };


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://asteroclicker5.firebaseio.com/"
});

export const addresses = {
    boost : '0x1129c0721a4200b3d0839e2a6079992e0b685959'
}

export const defaultDatabase = admin.database();