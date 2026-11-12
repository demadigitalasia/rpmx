# Panduan Deploy RPMX di VPS

Panduan lengkap men-deploy website RPMX (Next.js 16 + PostgreSQL) ke VPS
Ubuntu menggunakan Docker, Nginx, dan HTTPS Let's Encrypt.

> Asumsi: VPS Ubuntu 22.04/24.04, sudah punya domain yang mengarah (A record)
> ke IP VPS. Ganti `domainanda.com` dengan domain Anda di semua perintah.

---

## 1. Persiapan VPS

```bash
sudo apt update && sudo apt upgrade -y

# Docker + Compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # logout & login lagi agar berlaku

# Firewall (biarkan 80/443, aplikasi jalan via Nginx)
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443
sudo ufw enable
```

## 2. Ambil Kode & Konfigurasi

```bash
git clone <url-repo-anda> rpmx && cd rpmx

# Buat file .env produksi
cat > .env <<'EOF'
# PostgreSQL (container db)
POSTGRES_USER=rpmx
POSTGRES_PASSWORD=GANTI-password-db-yang-kuat
POSTGRES_DB=rpmx

# Aplikasi
NEXT_PUBLIC_SITE_URL=https://domainanda.com
ADMIN_PASSWORD=GANTI-password-admin
EOF

chmod 600 .env
```

## 3. Build & Jalankan

```bash
docker compose up -d --build
docker compose logs -f app     # tunggu sampai "Ready" lalu Ctrl+C
```

Yang terjadi otomatis:
1. Container `db` (PostgreSQL 17) berjalan dengan volume persisten.
2. Container `app` build image Next.js (standalone), lalu **menjalankan
   migrasi** (`scripts/migrate.mjs`) sebelum server menyala.
3. Aplikasi mendengarkan di `127.0.0.1:3000` (tidak terekspos publik).

Seed konten awal (opsional, sekali saja — dari mesin dev dengan
`DATABASE_URL` yang menunjuk ke DB VPS):

```bash
DATABASE_URL="postgresql://rpmx:PASSWORD_DB@IP_VPS:5432/rpmx" npm run db:seed
```

> Praktisnya: seed hanya dibutuhkan bila Anda ingin mengelola layanan/galeri
> lewat database. Tanpa seed, website tetap menampilkan konten default.
> (Pastikan port 5432 hanya dibuka ke IP Anda bila ingin akses DB dari luar
> VPS; cara paling aman adalah SSH tunnel: `ssh -L 5432:localhost:5432 vps`.)

## 4. Nginx (Reverse Proxy) + SSL

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

sudo tee /etc/nginx/sites-available/rpmx > /dev/null <<'EOF'
server {
    listen 80;
    server_name domainanda.com;

    client_max_body_size 5m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/rpmx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# HTTPS otomatis
sudo certbot --nginx -d domainanda.com --redirect
```

Website live di `https://domainanda.com`. 🎉

## 5. Update Versi

```bash
cd rpmx
git pull
docker compose up -d --build
```

Migrasi skema baru: commit folder `drizzle/` dari mesin dev
(`npm run db:generate`), lalu `--build` di atas otomatis menerapkannya
saat container start.

## 6. Backup Database (Penting!)

Backup harian pukul 02.00, disimpan 14 hari:

```bash
sudo tee /etc/cron.d/rpmx-backup > /dev/null <<'EOF'
0 2 * * * root docker compose -f /home/USER/rpmx/docker-compose.yml exec -T db pg_dump -U rpmx rpmx | gzip > /var/backups/rpmx-$(date +\%F).sql.gz && find /var/backups -name 'rpmx-*.sql.gz' -mtime +14 -delete
EOF
```

> Ganti `USER` dengan username VPS Anda. Restore:
> `gunzip -c rpmx-2026-01-01.sql.gz | docker compose exec -T db psql -U rpmx rpmx`

## 7. Perintah Berguna

| Perintah | Fungsi |
|---|---|
| `docker compose ps` | Status container |
| `docker compose logs -f app` | Log aplikasi |
| `docker compose restart app` | Restart aplikasi |
| `docker compose down` | Stop semua (data DB aman di volume) |
| `docker compose exec db psql -U rpmx rpmx` | Masuk ke konsol PostgreSQL |
| `docker compose exec app node scripts/migrate.mjs` | Jalankan migrasi manual |

## 8. Troubleshooting

- **502 Bad Gateway** → `docker compose ps` dan `docker compose logs app`;
  biasanya aplikasi masih build/migrasi, tunggu ~30 detik.
- **Form penawaran error** → pastikan `DATABASE_URL` benar dan tabel sudah
  dimigrasikan (`docker compose exec app node scripts/migrate.mjs`).
- **Lupa password admin** → ubah `ADMIN_PASSWORD` di `.env` lalu
  `docker compose up -d --force-recreate app`.
- **Konten tidak berubah setelah edit DB** → konten publik ter-cache ±1 menit
  (ISR); tunggu sebentar atau restart app.
