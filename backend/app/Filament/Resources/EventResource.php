<?php

namespace App\Filament\Resources;

use App\Enums\EventStatus;
use App\Filament\Resources\EventResource\Pages;
use App\Filament\Resources\EventResource\RelationManagers;
use App\Models\Event;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static ?string $navigationGroup = 'Agenda & Kegiatan';

    protected static ?string $navigationLabel = 'Agenda & Reuni';

    protected static ?string $modelLabel = 'Agenda';

    protected static ?string $pluralModelLabel = 'Agenda & Reuni';

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(12)
                    ->schema([
                        // Left Column: Main Event Information (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Informasi Utama Kegiatan')
                                ->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->label('Judul Agenda / Kegiatan')
                                        ->placeholder('Contoh: Temu Kangen Akbar Lintas Angkatan 2026...')
                                        ->required()
                                        ->maxLength(255)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (string $operation, ?string $state, Forms\Set $set): void {
                                            if ($operation === 'create' && filled($state)) {
                                                $set('slug', Str::slug($state));
                                            }
                                        }),

                                    Forms\Components\TextInput::make('slug')
                                        ->label('Slug URL')
                                        ->placeholder('judul-agenda-otomatis')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(Event::class, 'slug', ignoreRecord: true)
                                        ->helperText('Otomatis dihasilkan dari judul kegiatan.')
                                        ->suffixAction(
                                            Action::make('generateSlug')
                                                ->icon('heroicon-m-arrow-path')
                                                ->tooltip('Buat ulang slug dari judul saat ini')
                                                ->action(function (Forms\Get $get, Forms\Set $set): void {
                                                    $title = $get('title');
                                                    if (filled($title)) {
                                                        $set('slug', Str::slug($title));
                                                    }
                                                })
                                        ),

                                    Forms\Components\Grid::make(2)
                                        ->schema([
                                            Forms\Components\Select::make('category_id')
                                                ->label('Kategori Kegiatan')
                                                ->relationship('category', 'name')
                                                ->searchable()
                                                ->preload()
                                                ->required()
                                                ->createOptionForm([
                                                    Forms\Components\TextInput::make('name')
                                                        ->label('Nama Kategori')
                                                        ->required()
                                                        ->live(onBlur: true)
                                                        ->afterStateUpdated(fn ($state, Forms\Set $set) => $set('slug', Str::slug($state))),
                                                    Forms\Components\TextInput::make('slug')
                                                        ->label('Slug')
                                                        ->required(),
                                                    Forms\Components\Textarea::make('description')
                                                        ->label('Deskripsi'),
                                                ]),

                                            Forms\Components\TextInput::make('location')
                                                ->label('Lokasi Kegiatan / Platform')
                                                ->placeholder('Misal: Kampus MAN 3 Sleman / Zoom Meeting')
                                                ->helperText('Tuliskan "Online" atau "Zoom" jika kegiatan daring.')
                                                ->required()
                                                ->maxLength(255),
                                        ]),

                                    Forms\Components\RichEditor::make('description')
                                        ->label('Deskripsi Lengkap Kegiatan')
                                        ->placeholder('Tuliskan rincian agenda, rundown, susunan panitia, atau perlengkapan yang perlu dibawa...')
                                        ->required()
                                        ->toolbarButtons([
                                            'blockquote',
                                            'bold',
                                            'bulletList',
                                            'h2',
                                            'h3',
                                            'italic',
                                            'link',
                                            'orderedList',
                                            'redo',
                                            'underline',
                                            'undo',
                                        ])
                                        ->columnSpanFull(),

                                    Forms\Components\FileUpload::make('cover_image')
                                        ->label('Foto Sampul / Poster Kegiatan')
                                        ->image()
                                        ->disk('public')
                                        ->directory('events/covers')
                                        ->visibility('public')
                                        ->imageEditor()
                                        ->imageCropAspectRatio('16:9')
                                        ->helperText('Format JPG, PNG, atau WebP rasio 16:9 ideal untuk banner.'),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Scheduling, Quota, & Publishing (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Status & Publikasi')
                                ->schema([
                                    Forms\Components\Select::make('status')
                                        ->label('Status Agenda')
                                        ->options([
                                            'draft' => 'Draf (Draft)',
                                            'published' => 'Diterbitkan (Published)',
                                            'cancelled' => 'Dibatalkan (Cancelled)',
                                            'completed' => 'Selesai (Completed)',
                                            'archived' => 'Diarsipkan (Archived)',
                                        ])
                                        ->default('published')
                                        ->required(),

                                    Forms\Components\Hidden::make('created_by')
                                        ->default(fn () => auth()->id()),
                                ]),

                            Forms\Components\Section::make('Waktu Pelaksanaan')
                                ->schema([
                                    Forms\Components\DateTimePicker::make('start_at')
                                        ->label('Waktu Mulai')
                                        ->required()
                                        ->native(false)
                                        ->seconds(false)
                                        ->default(now()->addDays(7)->setHour(9)->setMinute(0)),

                                    Forms\Components\DateTimePicker::make('end_at')
                                        ->label('Waktu Selesai')
                                        ->native(false)
                                        ->seconds(false)
                                        ->after('start_at'),
                                ]),

                            Forms\Components\Section::make('Ketentuan Kuota & RSVP')
                                ->schema([
                                    Forms\Components\TextInput::make('max_participants')
                                        ->label('Kapasitas / Batas Kuota')
                                        ->numeric()
                                        ->placeholder('Contoh: 200')
                                        ->helperText('Kosongkan jika kuota peserta tidak dibatasi.'),

                                    Forms\Components\DateTimePicker::make('registration_start_at')
                                        ->label('Mulai Pendaftaran RSVP')
                                        ->native(false)
                                        ->seconds(false)
                                        ->default(now()),

                                    Forms\Components\DateTimePicker::make('registration_end_at')
                                        ->label('Batas Akhir Pendaftaran')
                                        ->native(false)
                                        ->seconds(false),
                                ]),
                        ])->columnSpan(['lg' => 4]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Sampul')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(asset('images/doc-baksos.jpg'))
                    ->checkFileExistence(false)
                    ->getStateUsing(function (Event $record): ?string {
                        if (empty($record->cover_image)) {
                            return null;
                        }

                        if (str_starts_with($record->cover_image, 'http://') || str_starts_with($record->cover_image, 'https://')) {
                            return $record->cover_image;
                        }

                        if (str_starts_with($record->cover_image, '/images/') || str_starts_with($record->cover_image, 'images/')) {
                            return asset(ltrim($record->cover_image, '/'));
                        }

                        return asset('storage/' . ltrim($record->cover_image, '/'));
                    }),

                Tables\Columns\TextColumn::make('title')
                    ->label('Judul Kegiatan')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->wrap()
                    ->description(fn (Event $record): ?string => $record->location),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategori')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_at')
                    ->label('Waktu Pelaksanaan')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->description(fn (Event $record): ?string => $record->end_at ? 's/d ' . $record->end_at->format('d M Y, H:i') : null),

                Tables\Columns\TextColumn::make('rsvps_count')
                    ->counts(['rsvps' => fn ($q) => $q->where('status', 'registered')])
                    ->label('Peserta RSVP')
                    ->badge()
                    ->color('teal')
                    ->sortable(),

                Tables\Columns\TextColumn::make('max_participants')
                    ->label('Kuota')
                    ->formatStateUsing(fn ($state) => $state ? "{$state} org" : 'Terbuka')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (EventStatus|string $state): string => match ($state instanceof EventStatus ? $state->value : $state) {
                        'published' => 'success',
                        'draft' => 'warning',
                        'completed' => 'info',
                        'cancelled' => 'danger',
                        'archived' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (EventStatus|string $state): string => match ($state instanceof EventStatus ? $state->value : $state) {
                        'published' => 'Diterbitkan',
                        'draft' => 'Draf',
                        'completed' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                        'archived' => 'Diarsipkan',
                        default => (string) $state,
                    })
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('deleted_at')
                    ->label('Dihapus')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('start_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Filter Kategori')
                    ->preload(),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'published' => 'Diterbitkan',
                        'draft' => 'Draf',
                        'completed' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                        'archived' => 'Diarsipkan',
                    ]),

                Tables\Filters\TrashedFilter::make()
                    ->label('Status Penghapusan (Sampah)'),
            ])
            ->actions([
                Tables\Actions\Action::make('preview_portal')
                    ->label('Lihat')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn (Event $record): string => rtrim(config('app.frontend_url', env('FRONTEND_URL', 'https://alumni.mayoga.sch.id')), '/') . ($record->slug ? "/events/{$record->slug}" : '/events'))
                    ->openUrlInNewTab()
                    ->hidden(fn (Event $record): bool => $record->trashed()),

                Tables\Actions\EditAction::make(),
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\DeleteAction::make(),
                    Tables\Actions\RestoreAction::make(),
                    Tables\Actions\ForceDeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\RsvpsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEvents::route('/'),
            'create' => Pages\CreateEvent::route('/create'),
            'edit' => Pages\EditEvent::route('/{record}/edit'),
        ];
    }
}
