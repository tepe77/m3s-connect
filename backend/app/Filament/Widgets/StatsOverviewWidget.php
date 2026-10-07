<?php

namespace App\Filament\Widgets;

use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Filament\Resources\AlumniVerificationResource;
use App\Filament\Resources\ForumCategoryResource;
use App\Filament\Resources\ReportResource;
use App\Models\ForumThread;
use App\Models\Report;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $activeAlumniCount = User::where('role', UserRole::ALUMNI)
            ->where('status', UserStatus::ACTIVE)
            ->count();

        $pendingAlumniCount = User::where('role', UserRole::ALUMNI)
            ->where('status', UserStatus::PENDING)
            ->count();

        $pendingReportsCount = Report::where('status', ReportStatus::PENDING)
            ->count();

        $activeThreadsCount = ForumThread::where('status', 'published')
            ->count();

        return [
            Stat::make('Alumni Terdaftar', number_format($activeAlumniCount, 0, ',', '.'))
                ->description('Anggota aktif terverifikasi')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->chart([12, 18, 25, 34, 46, 55, $activeAlumniCount > 0 ? $activeAlumniCount : 60])
                ->color('success'),

            Stat::make('Verifikasi Tertunda', (string) $pendingAlumniCount)
                ->description($pendingAlumniCount > 0 ? 'Menunggu persetujuan staf' : 'Semua pendaftar telah diverifikasi')
                ->descriptionIcon('heroicon-m-user-plus')
                ->color($pendingAlumniCount > 0 ? 'warning' : 'gray')
                ->url(AlumniVerificationResource::getUrl('index')),

            Stat::make('Laporan Konten & Spam', (string) $pendingReportsCount)
                ->description($pendingReportsCount > 0 ? 'Perlu tindakan moderator' : 'Komunitas bersih dari spam')
                ->descriptionIcon('heroicon-m-shield-exclamation')
                ->color($pendingReportsCount > 0 ? 'danger' : 'gray')
                ->url(ReportResource::getUrl('index')),

            Stat::make('Topik Diskusi Forum', (string) $activeThreadsCount)
                ->description('Total utas percakapan warga')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('primary')
                ->url(ForumCategoryResource::getUrl('index')),
        ];
    }
}
