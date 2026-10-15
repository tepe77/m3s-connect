<?php

namespace App\Filament\Resources\EventResource\RelationManagers;

use App\Enums\RsvpStatus;
use App\Models\EventRsvp;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class RsvpsRelationManager extends RelationManager
{
    protected static string $relationship = 'rsvps';

    protected static ?string $title = 'Daftar Peserta (RSVP)';

    protected static ?string $modelLabel = 'Peserta';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('Alumni / Pengguna')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\Select::make('status')
                    ->label('Status Kehadiran')
                    ->options([
                        'registered' => 'Terdaftar (Registered)',
                        'attended' => 'Hadir di Lokasi (Attended)',
                        'cancelled' => 'Dibatalkan (Cancelled)',
                        'no_show' => 'Tidak Hadir (No Show)',
                    ])
                    ->default('registered')
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('user.name')
            ->columns([
                Tables\Columns\ImageColumn::make('user.avatar_url')
                    ->label('Foto')
                    ->circular()
                    ->defaultImageUrl(asset('images/avatar-ahmad.jpg'))
                    ->checkFileExistence(false),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Nama Alumni')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (EventRsvp $record): ?string => $record->user?->email),
                Tables\Columns\TextColumn::make('user.profile.graduation_year')
                    ->label('Angkatan')
                    ->badge()
                    ->color('info')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (RsvpStatus|string $state): string => match ($state instanceof RsvpStatus ? $state->value : $state) {
                        'registered' => 'warning',
                        'attended' => 'success',
                        'cancelled' => 'gray',
                        'no_show' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('registered_at')
                    ->label('Waktu Mendaftar')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'registered' => 'Terdaftar',
                        'attended' => 'Hadir',
                        'cancelled' => 'Dibatalkan',
                        'no_show' => 'Tidak Hadir',
                    ]),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Tambah Peserta Manual'),
            ])
            ->actions([
                Tables\Actions\Action::make('markAttended')
                    ->label('Tandai Hadir')
                    ->icon('heroicon-m-check-circle')
                    ->color('success')
                    ->visible(fn (EventRsvp $record): bool => ($record->status instanceof RsvpStatus ? $record->status->value : $record->status) !== 'attended')
                    ->action(fn (EventRsvp $record) => $record->update(['status' => RsvpStatus::ATTENDED])),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
