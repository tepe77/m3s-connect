<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ForumCategoryResource\Pages;
use App\Models\ForumCategory;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ForumCategoryResource extends Resource
{
    protected static ?string $model = ForumCategory::class;

    protected static ?string $navigationGroup = 'Forum Komunitas';

    protected static ?string $navigationLabel = 'Kategori Forum';

    protected static ?string $modelLabel = 'Kategori Forum';

    protected static ?string $pluralModelLabel = 'Kategori Forum';

    protected static ?string $navigationIcon = 'heroicon-o-folder-open';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(12)
                    ->schema([
                        // Left Column: Category Content and Identification (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Informasi Utama Kategori')
                                ->description('Atur judul dan cakupan topik diskusi komunitas madrasah.')
                                ->schema([
                                    Forms\Components\TextInput::make('name')
                                        ->label('Nama Kategori Forum')
                                        ->placeholder('Misal: Peluang Karir & Magang')
                                        ->required()
                                        ->maxLength(100)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (string $operation, ?string $state, Forms\Set $set): void {
                                            if ($operation === 'create' && filled($state)) {
                                                $set('slug', Str::slug($state));
                                            }
                                        }),

                                    Forms\Components\TextInput::make('slug')
                                        ->label('Slug URL Kategori')
                                        ->placeholder('peluang-karir-dan-magang')
                                        ->required()
                                        ->maxLength(100)
                                        ->unique(ForumCategory::class, 'slug', ignoreRecord: true)
                                        ->helperText('Otomatis dihasilkan dari nama kategori dengan tanda hubung (-) sebagai pengganti spasi.')
                                        ->suffixAction(
                                            Action::make('generateSlug')
                                                ->icon('heroicon-m-arrow-path')
                                                ->tooltip('Buat ulang slug dari nama kategori saat ini')
                                                ->action(function (Forms\Get $get, Forms\Set $set): void {
                                                    $name = $get('name');
                                                    if (filled($name)) {
                                                        $set('slug', Str::slug($name));
                                                    }
                                                })
                                        ),

                                    Forms\Components\Textarea::make('description')
                                        ->label('Deskripsi Ruang Diskusi')
                                        ->placeholder('Jelaskan tujuan dan jenis topik yang cocok didiskusikan dalam kategori ini...')
                                        ->rows(3)
                                        ->columnSpanFull()
                                        ->helperText('Deskripsi singkat akan tampil pada kartu kategori di portal alumni.'),
                                ])->columns(2),

                            Forms\Components\Section::make('Identitas Visual & Sampul')
                                ->description('Warna tema dan gambar latar kartu kategori pada tampilan grid komunitas.')
                                ->schema([
                                    Forms\Components\ColorPicker::make('color')
                                        ->label('Warna Aksen Identitas')
                                        ->default('#0D9488')
                                        ->required()
                                        ->helperText('Warna penanda badge dan kartu kategori (contoh: Toska Mayoga #0D9488).'),

                                    Forms\Components\Select::make('icon')
                                        ->label('Ikon Simbol')
                                        ->options([
                                            'chat' => '💬 Chat / Obrolan Umum',
                                            'briefcase' => '💼 Karir & Dunia Kerja',
                                            'calendar' => '📅 Agenda, Reuni & Kegiatan',
                                            'store' => '🏪 Wirausaha & Bisnis Alumni',
                                            'chip' => '💻 Rekayasa Teknologi & AI',
                                            'academic' => '🎓 Pendidikan & Studi Lanjut',
                                            'heart' => '❤️ Sosial, Baksos & Kemanusiaan',
                                            'globe' => '🌐 Komunitas Global & Wilayah',
                                        ])
                                        ->default('chat')
                                        ->required(),

                                    Forms\Components\FileUpload::make('image')
                                        ->label('Sampul Visual Kategori (Banner)')
                                        ->image()
                                        ->imageEditor()
                                        ->imageCropAspectRatio('16:9')
                                        ->directory('forum-categories')
                                        ->disk('public')
                                        ->visibility('public')
                                        ->maxSize(4096)
                                        ->columnSpanFull()
                                        ->helperText('Unggah berkas gambar sampul banner kategori forum (format JPG, PNG, atau WebP, maks. 4MB). Anda dapat melakukan crop dan sesuaikan rasio gambar dengan editor terintegrasi.'),
                                ])->columns(2),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Organization and Visibility (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Pengaturan & Visibilitas')
                                ->schema([
                                    Forms\Components\TextInput::make('sort_order')
                                        ->label('Urutan Tampil (Sort Order)')
                                        ->required()
                                        ->numeric()
                                        ->default(1)
                                        ->helperText('Urutan prioritas kategori pada menu filter dan tab utama forum.'),

                                    Forms\Components\Toggle::make('is_active')
                                        ->label('Status Aktif')
                                        ->default(true)
                                        ->required()
                                        ->helperText('Aktifkan agar kategori ini dapat dilihat dan digunakan oleh alumni untuk membuat topik.'),
                                ]),
                        ])->columnSpan(['lg' => 4]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Sampul')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(asset('images/hero-man3-sleman.jpg'))
                    ->checkFileExistence(false)
                    ->getStateUsing(function (ForumCategory $record): ?string {
                        if (empty($record->image)) {
                            return null;
                        }

                        if (str_starts_with($record->image, 'http://') || str_starts_with($record->image, 'https://')) {
                            return $record->image;
                        }

                        if (str_starts_with($record->image, '/images/') || str_starts_with($record->image, 'images/')) {
                            return asset(ltrim($record->image, '/'));
                        }

                        return asset('storage/' . ltrim($record->image, '/'));
                    }),

                Tables\Columns\ColorColumn::make('color')
                    ->label('Warna'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Kategori')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (ForumCategory $record): string => Str::limit($record->description ?? '', 55)),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug URL')
                    ->fontFamily('mono')
                    ->color('gray')
                    ->searchable(),

                Tables\Columns\TextColumn::make('threads_count')
                    ->counts('threads')
                    ->label('Jumlah Topik')
                    ->badge()
                    ->color('success')
                    ->sortable(),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\ToggleColumn::make('is_active')
                    ->label('Aktif'),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Filter Status Aktif')
                    ->placeholder('Semua Kategori')
                    ->trueLabel('Hanya Kategori Aktif')
                    ->falseLabel('Hanya Kategori Nonaktif'),
            ])
            ->actions([
                Tables\Actions\Action::make('preview_portal')
                    ->label('Lihat Forum')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn (ForumCategory $record): string => "http://localhost:3000/forum?category={$record->slug}")
                    ->openUrlInNewTab(),

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
            'index' => Pages\ListForumCategories::route('/'),
            'create' => Pages\CreateForumCategory::route('/create'),
            'edit' => Pages\EditForumCategory::route('/{record}/edit'),
        ];
    }
}
