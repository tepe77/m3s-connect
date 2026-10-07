<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsCategoryResource\Pages;
use App\Models\NewsCategory;
use Filament\Forms;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class NewsCategoryResource extends Resource
{
    protected static ?string $model = NewsCategory::class;

    protected static ?string $navigationGroup = 'Publikasi & Berita';

    protected static ?string $navigationLabel = 'Kategori Berita';

    protected static ?string $modelLabel = 'Kategori Berita';

    protected static ?string $pluralModelLabel = 'Kategori Berita';

    protected static ?string $navigationIcon = 'heroicon-o-folder';

    protected static ?int $navigationSort = 2;

    public static function getNavigationBadge(): ?string
    {
        $count = NewsCategory::count();
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
                        // Left Column: Category Info (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Informasi Kategori Berita')
                                ->schema([
                                    Forms\Components\TextInput::make('name')
                                        ->label('Nama Kategori')
                                        ->placeholder('Contoh: Kabar Alumni, Prestasi, dsb.')
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
                                        ->placeholder('nama-kategori-otomatis')
                                        ->required()
                                        ->maxLength(100)
                                        ->unique(NewsCategory::class, 'slug', ignoreRecord: true)
                                        ->helperText('Otomatis dibuat dari nama kategori dengan pemisah tanda hubung (-).')
                                        ->suffixAction(
                                            Action::make('generateSlug')
                                                ->icon('heroicon-m-arrow-path')
                                                ->tooltip('Buat ulang slug dari nama')
                                                ->action(function (Forms\Get $get, Forms\Set $set): void {
                                                    $name = $get('name');
                                                    if (filled($name)) {
                                                        $set('slug', Str::slug($name));
                                                    }
                                                })
                                        ),

                                    Forms\Components\Textarea::make('description')
                                        ->label('Deskripsi Kategori')
                                        ->placeholder('Jelaskan cakupan topik atau fokus konten untuk kategori ini...')
                                        ->rows(4)
                                        ->maxLength(500)
                                        ->helperText('Ringkasan cakupan topik untuk mempermudah klasifikasi artikel berita.'),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Parent Hierarchy (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Hirarki Kategori')
                                ->schema([
                                    Forms\Components\Select::make('parent_id')
                                        ->label('Kategori Induk (Parent)')
                                        ->relationship('parent', 'name')
                                        ->searchable()
                                        ->preload()
                                        ->placeholder('Tanpa Induk (Kategori Utama)')
                                        ->helperText('Kosongkan jika kategori ini merupakan kategori tingkat utama, atau pilih induk jika sebagai sub-kategori.'),
                                ]),
                        ])->columnSpan(['lg' => 4]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Kategori')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (NewsCategory $record): ?string => Str::limit($record->description, 50)),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug URL')
                    ->fontFamily('mono')
                    ->color('gray')
                    ->copyable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Kategori Induk')
                    ->badge()
                    ->color('info')
                    ->placeholder('Kategori Utama')
                    ->sortable(),

                Tables\Columns\TextColumn::make('news_count')
                    ->label('Jumlah Berita')
                    ->counts('news')
                    ->badge()
                    ->color('teal')
                    ->icon('heroicon-m-newspaper')
                    ->sortable(),

                Tables\Columns\TextColumn::make('children_count')
                    ->label('Sub-Kategori')
                    ->counts('children')
                    ->badge()
                    ->color('gray')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name', 'asc')
            ->filters([
                Tables\Filters\SelectFilter::make('parent_id')
                    ->label('Kategori Induk')
                    ->relationship('parent', 'name')
                    ->preload(),

                Tables\Filters\Filter::make('root_only')
                    ->label('Hanya Kategori Utama')
                    ->query(fn ($query) => $query->whereNull('parent_id')),

                Tables\Filters\Filter::make('children_only')
                    ->label('Hanya Sub-Kategori')
                    ->query(fn ($query) => $query->whereNotNull('parent_id')),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->before(function (Tables\Actions\DeleteAction $action, NewsCategory $record): void {
                        if ($record->news()->count() > 0) {
                            \Filament\Notifications\Notification::make()
                                ->title('Gagal Menghapus Kategori')
                                ->body("Kategori '{$record->name}' tidak dapat dihapus karena masih memiliki {$record->news()->count()} artikel berita terkait.")
                                ->danger()
                                ->send();

                            $action->cancel();
                        }
                    }),
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
            'index' => Pages\ListNewsCategories::route('/'),
            'create' => Pages\CreateNewsCategory::route('/create'),
            'edit' => Pages\EditNewsCategory::route('/{record}/edit'),
        ];
    }
}
