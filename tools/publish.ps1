# =====================================================
# School App - Publish Tool v2
# Workflow:
# develop -> commit -> push develop -> merge main -> push main -> kembali ke develop
# =====================================================

Clear-Host

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      SCHOOL APP - PUBLISH TOOL v2"
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# -----------------------------------------------------
# Pastikan berada di Git Repository
# -----------------------------------------------------
git rev-parse --is-inside-work-tree *> $null

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Folder ini bukan Git Repository." -ForegroundColor Red
    exit
}

# -----------------------------------------------------
# Ambil branch aktif
# -----------------------------------------------------
$currentBranch = (git branch --show-current).Trim()

switch ($currentBranch) {

    "develop" {
        Write-Host "Branch : develop" -ForegroundColor Green
    }

    "main" {

        Write-Host "Branch : main" -ForegroundColor Yellow
        Write-Host "Pindah ke develop..."

        git checkout develop

        if ($LASTEXITCODE -ne 0) { exit }

    }

    default {

        Write-Host ""
        Write-Host "ERROR: Branch '$currentBranch' tidak didukung." -ForegroundColor Red
        Write-Host "Gunakan branch develop."
        exit

    }
}

# -----------------------------------------------------
# Update develop
# -----------------------------------------------------
Write-Host ""
Write-Host "Update develop..." -ForegroundColor Cyan

git pull origin develop

if ($LASTEXITCODE -ne 0) { exit }

# -----------------------------------------------------
# Cek perubahan
# -----------------------------------------------------
$changes = git status --porcelain

if (-not $changes) {

    Write-Host ""
    Write-Host "Tidak ada perubahan." -ForegroundColor Yellow
    exit

}

Write-Host ""
git status
Write-Host ""

# -----------------------------------------------------
# Commit Message
# -----------------------------------------------------
$message = Read-Host "Commit Message"

if ([string]::IsNullOrWhiteSpace($message)) {

    Write-Host "Commit message tidak boleh kosong." -ForegroundColor Red
    exit

}

# -----------------------------------------------------
# Commit
# -----------------------------------------------------
Write-Host ""
Write-Host "===== DEVELOP =====" -ForegroundColor Green

git add .

if ($LASTEXITCODE -ne 0) { exit }

git commit -m "$message"

if ($LASTEXITCODE -ne 0) { exit }

git push origin develop

if ($LASTEXITCODE -ne 0) { exit }

# -----------------------------------------------------
# Merge
# -----------------------------------------------------
Write-Host ""
Write-Host "===== MAIN =====" -ForegroundColor Green

git checkout main

if ($LASTEXITCODE -ne 0) { exit }

git pull origin main

if ($LASTEXITCODE -ne 0) { exit }

git merge develop

if ($LASTEXITCODE -ne 0) {

    Write-Host ""
    Write-Host "Merge conflict." -ForegroundColor Red
    exit

}

git push origin main

if ($LASTEXITCODE -ne 0) { exit }

# -----------------------------------------------------
# Kembali ke develop
# -----------------------------------------------------
git checkout develop

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Publish BERHASIL"
Write-Host "========================================="

Write-Host ""
Write-Host "Langkah berikutnya:"
Write-Host "  1. Tunggu Deploy Vercel"
Write-Host "  2. Uji endpoint"
Write-Host "  3. Verifikasi Neon bila perlu"
Write-Host ""