<?php

namespace App\Filament\Resources\AlumniVerificationResource\Pages;

use App\Filament\Resources\AlumniVerificationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAlumniVerifications extends ListRecords
{
    protected static string $resource = AlumniVerificationResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
