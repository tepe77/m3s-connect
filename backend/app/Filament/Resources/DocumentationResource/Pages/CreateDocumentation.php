<?php

namespace App\Filament\Resources\DocumentationResource\Pages;

use App\Filament\Resources\DocumentationResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateDocumentation extends CreateRecord
{
    protected static string $resource = DocumentationResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if (empty($data['photo_count']) && ! empty($data['photos']) && is_array($data['photos'])) {
            $data['photo_count'] = count($data['photos']);
        }

        if (empty($data['cover_image']) && ! empty($data['photos']) && is_array($data['photos']) && isset($data['photos'][0])) {
            $data['cover_image'] = $data['photos'][0];
        }

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
