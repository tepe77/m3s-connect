<?php

namespace App\Filament\Resources;

use App\Filament\Resources\DocumentationResource\Pages;
use App\Models\Documentation;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class DocumentationResource extends Resource
{
    protected static ?string $model = Documentation::class;

    protected static ?string $navigationGroup = 'Galeri & Dokumentasi';

    protected static ?string $navigationLabel = 'Dokumentasi Kegiatan';

    protected static ?string $modelLabel = 'Dokumentasi';

    protected static ?string $pluralModelLabel = 'Galeri & Dokumentasi';

    protected static ?string $navigationIcon = 'heroicon-o-camera';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $count = Documentation::where('status', 'published')->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'teal';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(12)
                    ->schema([
                        // Left Column: Main Documentation Information & Gallery (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Informasi Utama Dokumentasi')
                                ->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->label('Judul Dokumentasi / Album')
                                        ->placeholder('Contoh: Reuni Akbar 2025, Wisuda Angkatan XX...')
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
                                        ->placeholder('judul-dokumentasi-otomatis')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(Documentation::class, 'slug', ignoreRecord: true)
                                        ->helperText('Otomatis dibuat dari judul kegiatan dengan pemisah tanda hubung (-).')
                                        ->suffixAction(
                                            Action::make('generateSlug')
                                                ->icon('heroicon-m-arrow-path')
                                                ->tooltip('Generate slug dari judul')
                                                ->action(function (Forms\Get $get, Forms\Set $set): void {
                                                    $title = $get('title');
                                                    if (filled($title)) {
                                                        $set('slug', Str::slug($title));
                                                    }
                                                })
                                        ),

                                    Forms\Components\Grid::make(2)
                                        ->schema([
                                            Forms\Components\Select::make('category')
                                                ->label('Kategori Kegiatan')
                                                ->options([
                                                    'Reuni & Temu Kangen' => 'Reuni & Temu Kangen',
                                                    'Sosial & Pengabdian' => 'Sosial & Pengabdian',
                                                    'Seremoni Madrasah' => 'Seremoni Madrasah',
                                                    'Akademik & Prestasi' => 'Akademik & Prestasi',
                                                    'Kegiatan Siswa & Ekstrakurikuler' => 'Kegiatan Siswa & Ekstrakurikuler',
                                                    'Lainnya' => 'Lainnya',
                                                ])
                                                ->searchable()
                                                ->required()
                                                ->default('Reuni & Temu Kangen'),

                                            Forms\Components\DatePicker::make('event_date')
                                                ->label('Tanggal Kegiatan')
                                                ->default(now())
                                                ->native(false)
                                                ->required(),
                                        ]),

                                    Forms\Components\Textarea::make('description')
                                        ->label('Deskripsi Dokumentasi')
                                        ->placeholder('Ceritakan ringkasan kegiatan, lokasi, kepanitiaan, atau momen berkesan...')
                                        ->rows(4)
                                        ->columnSpanFull(),
                                ]),

                            Forms\Components\Section::make('Galeri Foto & Album Kegiatan')
                                ->schema([
                                    Forms\Components\FileUpload::make('cover_image')
                                        ->label('Foto Sampul Utama (Cover)')
                                        ->image()
                                        ->disk('public')
                                        ->directory('documentations/covers')
                                        ->visibility('public')
                                        ->imageEditor()
                                        ->helperText('Foto utama yang dijadikan thumbnail di Beranda dan menu arsip galeri.'),

                                    Forms\Components\FileUpload::make('photos')
                                        ->label('Koleksi Foto Galeri (Multi Upload)')
                                        ->image()
                                        ->multiple()
                                        ->reorderable()
                                        ->disk('public')
                                        ->directory('documentations/gallery')
                                        ->visibility('public')
                                        ->helperText('Unggah foto-foto dokumentasi kegiatan secara massal. Bisa digeser untuk mengubah urutan tampilan.'),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Settings, Visibility, and Meta (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Visibilitas & Publikasi')
                                ->schema([
                                    Forms\Components\Toggle::make('is_featured')
                                        ->label('Tampilkan di Beranda')
                                        ->helperText('Aktifkan agar album dokumentasi ini tampil di widget "Dokumentasi Terbaru" halaman depan.')
                                        ->default(false),

                                    Forms\Components\Select::make('status')
                                        ->label('Status Dokumentasi')
                                        ->options([
                                            'published' => 'Diterbitkan (Published)',
                                            'draft' => 'Draf (Draft)',
                                            'archived' => 'Diarsipkan (Archived)',
                                        ])
                                        ->default('published')
                                        ->required(),

                                    Forms\Components\TextInput::make('photo_count')
                                        ->label('Jumlah Total Foto (Display)')
                                        ->numeric()
                                        ->placeholder('Contoh: 128')
                                        ->helperText('Bisa diisi manual atau otomatis terhitung dari foto yang diunggah.')
                                        ->default(0),

                                    Forms\Components\DateTimePicker::make('published_at')
                                        ->label('Waktu Publikasi')
                                        ->default(now())
                                        ->native(false),
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
                    ->rounded()
                    ->disk('public')
                    ->checkFileExistence(false)
                    ->getStateUsing(function (Documentation $record): ?string {
                        return $record->cover_image_url;
                    }),

                Tables\Columns\TextColumn::make('title')
                    ->label('Judul Dokumentasi')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Documentation $record): ?string => Str::limit($record->description, 50)),

                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color('teal')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('event_date')
                    ->label('Tgl Kegiatan')
                    ->date('d M Y')
                    ->sortable(),

                Tables\Columns\TextColumn::make('photo_count')
                    ->label('Jml Foto')
                    ->icon('heroicon-m-camera')
                    ->badge()
                    ->color('gray')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Beranda')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'success' => 'published',
                        'warning' => 'draft',
                        'gray' => 'archived',
                    ]),
            ])
            ->defaultSort('event_date', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label('Kategori')
                    ->options([
                        'Reuni & Temu Kangen' => 'Reuni & Temu Kangen',
                        'Sosial & Pengabdian' => 'Sosial & Pengabdian',
                        'Seremoni Madrasah' => 'Seremoni Madrasah',
                        'Akademik & Prestasi' => 'Akademik & Prestasi',
                        'Kegiatan Siswa & Ekstrakurikuler' => 'Kegiatan Siswa & Ekstrakurikuler',
                        'Lainnya' => 'Lainnya',
                    ]),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Tampil di Beranda'),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'published' => 'Published',
                        'draft' => 'Draft',
                        'archived' => 'Archived',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDocumentations::route('/'),
            'create' => Pages\CreateDocumentation::route('/create'),
            'edit' => Pages\EditDocumentation::route('/{record}/edit'),
        ];
    }
}
