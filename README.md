# ♻️ **Sortify** – *Sort & Verify*  

📌 **Senior Project TI**  
🏛 **Departemen Teknologi Elektro dan Teknologi Informasi, Fakultas Teknik, Universitas Gadjah Mada**  

---

## 👥 **Tim Pengembang**  

**Ketua Kelompok:**  
- Brandon Rafael Lovelyno *(22/500359/TK/54847)*  

**Anggota:**  
- Yodha Raya Nayaala *(22/498215/TK/54641)*  
- Muhammad Budi Setiawan *(22/505064/TK5524)*  

---

## 🌍 **Latar Belakang**  

Sampah menjadi permasalahan mendesak di Yogyakarta dengan **270.153 ton sampah** masuk ke TPA setiap tahun, menandakan sistem pengelolaan yang belum efektif. Saat ini, lebih dari **90% sampah berakhir di TPA**, akibat rendahnya tingkat pemilahan dan daur ulang, yang mempercepat krisis lingkungan.  

📊 **Fakta tentang Pengelolaan Sampah di Yogyakarta:**  
✅ **Hanya 1,2% rumah tangga** yang mendaur ulang sampah.  
🔥 **66,8% rumah tangga** lebih memilih membakar sampah, berisiko mencemari udara dan membahayakan kesehatan.  

🔴 **Permasalahan ini membutuhkan solusi konkret** berupa peningkatan kesadaran masyarakat, penerapan sistem pemilahan sejak dari sumber, serta optimalisasi pengelolaan sampah untuk menciptakan lingkungan yang lebih bersih dan berkelanjutan.  

---

## 💡 **Ide & Solusi – Sortify**  

**Sortify** hadir sebagai solusi berbasis **Computer Vision** untuk mengidentifikasi dan mengklasifikasikan sampah ke dalam **3 kategori**, sesuai dengan sistem pengelolaan sampah di Jerman:  

♻️ **Organik** – Sisa makanan, daun, dan bahan yang bisa terurai alami.  
📄 **Kertas** – Tidak dapat terurai alami.  
🛍 **Plastik** – Berbau, Beracun, Berbahaya. 

🔍 Dengan teknologi ini, Sortify dapat membantu masyarakat **lebih mudah memilah sampah**, mengurangi jumlah sampah yang masuk ke TPA, serta meningkatkan efisiensi **daur ulang dan keberlanjutan lingkungan**.  

---

## 🗂️ **Use Case Diagram**  

![WhatsApp Image 2025-02-20 at 22 27 08](https://github.com/user-attachments/assets/23c76db2-9311-4468-bc2c-163d08cd76ba)

---

## 🔗 **Entity Relationship Diagrams**  

![WhatsApp Image 2025-02-20 at 22 27 07](https://github.com/user-attachments/assets/3982c8a8-96a6-4665-a798-d324d30b9433)

## 🛠️ Instalasi Lokal
1. Clone Repository
```bash
git clone https://github.com/BrandonRafaelLovelyno/sortify-be
cd sortify-be
npm install
```
2. environment
```bash
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true
PORT=5000

JWT_SECRET=<long-random-secret>

MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=<your-email>
MAIL_PASS=<your-email-password>

DEVELOPMENT_FRONTEND_URL=https://your-dev-frontend.com
PRODUCTION_FRONTEND_URL=https://your-prod-frontend.com

FAST_API_URL=http://<ip-address>:8000/

NODE_ENV=development
NEXT_CLIENT_URL=https://your-client-url.com

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<cloud-api-key>
CLOUDINARY_API_SECRET=<cloud-api-secret>
```
3. Jalankan
```bash
npx prisma generate
npm run start:dev
npm run build        # Build aplikasi
npm run start:prod   # Jalankan produksi
npm run test         # Jalankan testing
npm run lint         # Periksa dan perbaiki kode
```

## Instalasi menggunakan docker
```bash
docker build -t sortify-frontend .
docker run -p 5000:5000 --env-file .env sortify-be
```
