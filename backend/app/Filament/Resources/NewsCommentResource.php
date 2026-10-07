<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsCommentResource\Pages;
use App\Models\NewsComment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class NewsCommentResource extends Resource
{
    protected static ?string $model = NewsComment::class;

    protected static ?string $navigationGroup = 'Publikasi & Berita';

    protected static ?string $navigationLabel = 'Moderasi Komentar';

    protected static ?string $modelLabel = 'Komentar Berita';

    protected static ?string $pluralModelLabel = 'Moderasi Komentar';

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';

    protected static ?int $navigationSort = 3;

    public static function getNavigationBadge(): ?string
    {
        $pendingCount = static::getModel()::where('is_approved', false)->count();

        return $pendingCount > 0 ? (string) $pendingCount : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(12)
                    ->schema([
                        // Left Column: Comment Content & Context (8 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Artikel Berita Terkait')
                                ->schema([
                                    Forms\Components\Select::make('news_id')
                                        ->relationship('news', 'title')
                                        ->label('Artikel Berita')
                                        ->required()
                                        ->searchable()
                                        ->preload()
                                        ->columnSpanFull()
                                        ->helperText('Artikel berita tempat komentar ini dikirimkan.'),
                                ]),

                            Forms\Components\Section::make('Isi Komentar')
                                ->schema([
                                    Forms\Components\Textarea::make('content')
                                        ->label('Naskah Komentar')
                                        ->rows(5)
                                        ->required()
                                        ->columnSpanFull()
                                        ->helperText('Periksa isi pesan komentar apakah mengandung spam, promosi terlarang, atau ujaran kebencian.'),
                                ]),
                        ])->columnSpan(['lg' => 8]),

                        // Right Column: Author Information & Moderation Status (4 cols)
                        Forms\Components\Group::make([
                            Forms\Components\Section::make('Status Moderasi')
                                ->schema([
                                    Forms\Components\Toggle::make('is_approved')
                                        ->label('Status Disetujui (Approved)')
                                        ->default(true)
                                        ->required()
                                        ->helperText('Aktifkan agar komentar dapat dibaca secara publik pada halaman artikel portal.'),
                                ]),

                            Forms\Components\Section::make('Identitas Pengirim')
                                ->schema([
                                    Forms\Components\Select::make('user_id')
                                        ->relationship('user', 'name')
                                        ->label('Akun Alumni Terdaftar')
                                        ->nullable()
                                        ->searchable()
                                        ->preload()
                                        ->helperText('Opsional, jika pengirim berkomentar saat sudah login.'),

                                    Forms\Components\TextInput::make('author_name')
                                        ->label('Nama Pengirim')
                                        ->required()
                                        ->maxLength(100),

                                    Forms\Components\TextInput::make('author_email')
                                        ->label('Email Pengirim')
                                        ->email()
                                        ->required()
                                        ->maxLength(150),

                                    Forms\Components\TextInput::make('author_url')
                                        ->label('Website / Media Sosial')
                                        ->url()
                                        ->maxLength(255),
                                ]),

                            Forms\Components\Section::make('Jejak Teknis')
                                ->collapsed()
                                ->schema([
                                    Forms\Components\TextInput::make('ip_address')
                                        ->label('Alamat IP')
                                        ->disabled(),

                                    Forms\Components\TextInput::make('user_agent')
                                        ->label('User Agent Browser')
                                        ->disabled(),
                                ]),
                        ])->columnSpan(['lg' => 4]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu Kirim')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('author_name')
                    ->label('Pengirim')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn (NewsComment $record): string => $record->author_email)
                    ->wrap(),

                Tables\Columns\TextColumn::make('news.title')
                    ->label('Artikel Berita')
                    ->limit(35)
                    ->tooltip(fn (NewsComment $record): ?string => $record->news?->title)
                    ->searchable()
                    ->wrap(),

                Tables\Columns\TextColumn::make('content')
                    ->label('Isi Pesan')
                    ->limit(65)
                    ->wrap()
                    ->searchable(),

                Tables\Columns\ToggleColumn::make('is_approved')
                    ->label('Disetujui')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_approved')
                    ->label('Status Moderasi')
                    ->placeholder('Semua Komentar')
                    ->trueLabel('Hanya Disetujui')
                    ->falseLabel('Menunggu Moderasi (Pending)'),

                Tables\Filters\SelectFilter::make('news_id')
                    ->relationship('news', 'title')
                    ->label('Filter Berita')
                    ->searchable()
                    ->preload(),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Setujui')
                    ->icon('heroicon-m-check-circle')
                    ->color('success')
                    ->visible(fn (NewsComment $record): bool => ! $record->is_approved)
                    ->action(function (NewsComment $record): void {
                        $record->update(['is_approved' => true]);
                        Notification::make()
                            ->title('Komentar Disetujui')
                            ->body('Komentar dari ' . $record->author_name . ' kini tampil di portal publik.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('Tahan')
                    ->icon('heroicon-m-x-circle')
                    ->color('warning')
                    ->visible(fn (NewsComment $record): bool => (bool) $record->is_approved)
                    ->action(function (NewsComment $record): void {
                        $record->update(['is_approved' => false]);
                        Notification::make()
                            ->title('Komentar Ditahan')
                            ->body('Komentar dari ' . $record->author_name . ' telah disembunyikan dari publik.')
                            ->warning()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Setujui Terpilih')
                        ->icon('heroicon-m-check')
                        ->color('success')
                        ->action(function (Collection $records): void {
                            $records->each->update(['is_approved' => true]);
                            Notification::make()
                                ->title('Komentar Disetujui')
                                ->body(count($records) . ' komentar berhasil disetujui.')
                                ->success()
                                ->send();
                        }),

                    Tables\Actions\BulkAction::make('hold_selected')
                        ->label('Tahan Terpilih')
                        ->icon('heroicon-m-x-mark')
                        ->color('warning')
                        ->action(function (Collection $records): void {
                            $records->each->update(['is_approved' => false]);
                            Notification::make()
                                ->title('Komentar Ditahan')
                                ->body(count($records) . ' komentar berhasil disembunyikan.')
                                ->warning()
                                ->send();
                        }),

                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsComments::route('/'),
            'create' => Pages\CreateNewsComment::route('/create'),
            'edit' => Pages\EditNewsComment::route('/{record}/edit'),
        ];
    }
}
