<?php

namespace App\Filament\Resources;

use App\Enums\NewsStatus;
use App\Filament\Resources\NewsResource\Pages;
use App\Models\News;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;

    protected static ?string $navigationGroup = 'Publikasi & Berita';

    protected static ?string $navigationLabel = 'Berita & Pengumuman';

    protected static ?string $modelLabel = 'Berita';

    protected static ?string $pluralModelLabel = 'Berita & Pengumuman';

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(12)
                    ->schema([
                        // Left Column: Main Article Content (8 columns)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Konten Utama Berita')
                                ->schema([
                                    Forms\Components\TextInput::make('title')
                                        ->label('Judul Berita')
                                        ->placeholder('Masukkan judul artikel atau pengumuman madrasah...')
                                        ->required()
                                        ->maxLength(255)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (string $operation, ?string $state, Forms\Set $set): void {
                                            if ($operation === 'create' && filled($state)) {
                                                $set('slug', Str::slug($state));
                                            }
                                        }),

                                    Forms\Components\TextInput::make('slug')
                                        ->label('Slug URL Berita')
                                        ->placeholder('judul-berita-otomatis')
                                        ->required()
                                        ->maxLength(255)
                                        ->unique(News::class, 'slug', ignoreRecord: true)
                                        ->helperText('Otomatis dihasilkan dari judul dengan tanda hubung (-) sebagai pengganti spasi.')
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

                                    Forms\Components\RichEditor::make('content')
                                        ->label('Isi Berita (WYSIWYG Editor)')
                                        ->placeholder('Tuliskan naskah lengkap berita di sini... Mendukung format paragraf, heading, gambar, kutipan, dan tabel.')
                                        ->required()
                                        ->toolbarButtons([
                                            'attachFiles',
                                            'blockquote',
                                            'bold',
                                            'bulletList',
                                            'codeBlock',
                                            'h2',
                                            'h3',
                                            'italic',
                                            'link',
                                            'orderedList',
                                            'redo',
                                            'strike',
                                            'underline',
                                            'undo',
                                        ])
                                        ->fileAttachmentsDisk('public')
                                        ->fileAttachmentsDirectory('news/attachments')
                                        ->columnSpanFull(),

                                    Forms\Components\Textarea::make('excerpt')
                                        ->label('Ringkasan Singkat (Excerpt)')
                                        ->placeholder('Ringkasan 1-2 kalimat untuk pratinjau di halaman beranda...')
                                        ->rows(3)
                                        ->helperText('Cuplikan paragraf pembuka yang muncul pada kartu direktori berita.')
                                        ->columnSpanFull(),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Publishing, Meta, and Media (4 columns)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Pengaturan Publikasi')
                                ->schema([
                                    Forms\Components\Select::make('status')
                                        ->label('Status Berita')
                                        ->options([
                                            'draft' => 'Draf (Draft)',
                                            'published' => 'Diterbitkan (Published)',
                                            'archived' => 'Diarsipkan (Archived)',
                                        ])
                                        ->default('draft')
                                        ->required(),

                                    Forms\Components\DateTimePicker::make('published_at')
                                        ->label('Waktu Publikasi')
                                        ->default(now())
                                        ->native(false)
                                        ->seconds(false),

                                    Forms\Components\Select::make('author_id')
                                        ->label('Penulis / Kontributor')
                                        ->relationship('author', 'name')
                                        ->default(fn () => auth()->id())
                                        ->required()
                                        ->searchable()
                                        ->preload(),
                                ]),

                            Forms\Components\Section::make('Kategori & Tagar')
                                ->schema([
                                    Forms\Components\Select::make('category_id')
                                        ->label('Kategori Berita')
                                        ->relationship('category', 'name')
                                        ->required()
                                        ->searchable()
                                        ->preload(),

                                    Forms\Components\TagsInput::make('tags')
                                        ->label('Tagar Terkait')
                                        ->placeholder('Ketik tagar lalu tekan enter')
                                        ->separator(','),
                                ]),

                            Forms\Components\Section::make('Sampul Berita (Featured Image)')
                                ->schema([
                                    Forms\Components\FileUpload::make('cover_image')
                                        ->label('Foto Sampul Utama')
                                        ->image()
                                        ->disk('public')
                                        ->directory('news/covers')
                                        ->visibility('public')
                                        ->imageEditor()
                                        ->imageCropAspectRatio('16:9')
                                        ->helperText('Format JPG/PNG/WebP rasio ideal 16:9.'),
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
                    ->defaultImageUrl(asset('images/news-reuni.jpg'))
                    ->checkFileExistence(false)
                    ->getStateUsing(function (News $record): ?string {
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
                    ->label('Judul Berita')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->wrap(),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategori')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('author.name')
                    ->label('Penulis')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (NewsStatus|string $state): string => match ($state instanceof NewsStatus ? $state->value : $state) {
                        'published' => 'success',
                        'draft' => 'warning',
                        'archived' => 'gray',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('all_comments_count')
                    ->counts('allComments')
                    ->label('Komentar')
                    ->badge()
                    ->color('gray')
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Tgl Terbit')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Filter Kategori'),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'draft' => 'Draf',
                        'published' => 'Diterbitkan',
                        'archived' => 'Diarsipkan',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('preview_portal')
                    ->label('Lihat')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn (News $record): string => "http://localhost:3000/news/{$record->slug}")
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
            'index' => Pages\ListNews::route('/'),
            'create' => Pages\CreateNews::route('/create'),
            'edit' => Pages\EditNews::route('/{record}/edit'),
        ];
    }
}
