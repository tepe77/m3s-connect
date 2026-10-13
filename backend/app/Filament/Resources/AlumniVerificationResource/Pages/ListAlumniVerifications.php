<?php

namespace App\Filament\Resources\AlumniVerificationResource\Pages;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Filament\Resources\AlumniVerificationResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListAlumniVerifications extends ListRecords
{
    protected static string $resource = AlumniVerificationResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getTabs(): array
    {
        return [
            'pending' => Tab::make('Menunggu Verifikasi')
                ->icon('heroicon-m-clock')
                ->badge(User::where('role', UserRole::ALUMNI)->where('status', UserStatus::PENDING)->count())
                ->badgeColor('warning')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', UserStatus::PENDING)),

            'verified' => Tab::make('Terverifikasi')
                ->icon('heroicon-m-check-badge')
                ->badge(User::where('role', UserRole::ALUMNI)->where('status', UserStatus::ACTIVE)->count())
                ->badgeColor('success')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', UserStatus::ACTIVE)),

            'suspended' => Tab::make('Ditolak / Ditangguhkan')
                ->icon('heroicon-m-x-circle')
                ->badge(User::where('role', UserRole::ALUMNI)->where('status', UserStatus::SUSPENDED)->count())
                ->badgeColor('danger')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', UserStatus::SUSPENDED)),

            'all' => Tab::make('Semua Calon')
                ->icon('heroicon-m-users'),
        ];
    }

    public function getDefaultActiveTab(): string | int | null
    {
        return 'pending';
    }
}
