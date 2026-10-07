<?php

namespace App\Filament\Resources\NewsCommentResource\Pages;

use App\Filament\Resources\NewsCommentResource;
use App\Models\NewsComment;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListNewsComments extends ListRecords
{
    protected static string $resource = NewsCommentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Tambah Komentar Manual'),
        ];
    }

    public function getTabs(): array
    {
        $pendingCount = NewsComment::where('is_approved', false)->count();

        return [
            'all' => Tab::make('Semua Komentar'),
            'pending' => Tab::make('Menunggu Moderasi')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('is_approved', false))
                ->badge($pendingCount > 0 ? (string) $pendingCount : null)
                ->badgeColor('warning'),
            'approved' => Tab::make('Disetujui')
                ->modifyQueryUsing(fn (Builder $query): Builder => $query->where('is_approved', true)),
        ];
    }
}
