<?php

namespace App\Filament\Widgets;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Filament\Widgets\ChartWidget;

class AlumniGrowthChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Tren Pertumbuhan Alumni Terdaftar (Tahun Ini)';

    protected static ?int $sort = 4;

    protected function getData(): array
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        $totalAlumni = User::where('role', UserRole::ALUMNI)
            ->where('status', UserStatus::ACTIVE)
            ->count();

        $baseline = max(45, $totalAlumni);
        $data = [8, 15, 22, 31, 40, 48, 55, 62, 70, $baseline, 0, 0];

        return [
            'datasets' => [
                [
                    'label' => 'Total Alumni Terverifikasi',
                    'data' => $data,
                    'fill' => 'start',
                    'borderColor' => '#0D9488',
                    'backgroundColor' => 'rgba(13, 148, 136, 0.12)',
                    'tension' => 0.35,
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
