<?php

namespace App\Filament\Resources\NewsCommentResource\Pages;

use App\Filament\Resources\NewsCommentResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNewsComment extends EditRecord
{
    protected static string $resource = NewsCommentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
