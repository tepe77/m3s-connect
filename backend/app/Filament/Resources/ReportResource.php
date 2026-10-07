<?php

namespace App\Filament\Resources;

use App\Enums\ReportStatus;
use App\Filament\Resources\ReportResource\Pages;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\Report;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static ?string $navigationGroup = 'Moderasi Komunitas';

    protected static ?string $navigationLabel = 'Laporan Konten & Spam';

    protected static ?string $modelLabel = 'Laporan Konten';

    protected static ?string $pluralModelLabel = 'Laporan Konten & Spam';

    protected static ?string $navigationIcon = 'heroicon-o-shield-exclamation';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('status', ReportStatus::PENDING)->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Detail Laporan Pelanggaran')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('reporter', 'name')
                            ->label('Pelapor')
                            ->disabled(),
                        Forms\Components\TextInput::make('reason')
                            ->label('Alasan Pelaporan')
                            ->disabled(),
                        Forms\Components\TextInput::make('reportable_type')
                            ->label('Tipe Konten Terlapor')
                            ->disabled(),
                        Forms\Components\TextInput::make('reportable_id')
                            ->label('ID Konten Terlapor')
                            ->disabled(),
                        Forms\Components\Textarea::make('description')
                            ->label('Catatan Keterangan Pelapor')
                            ->columnSpanFull()
                            ->disabled(),
                        Forms\Components\Select::make('status')
                            ->label('Status Tindakan')
                            ->options([
                                'pending' => 'Menunggu Tindakan (Pending)',
                                'reviewing' => 'Dalam Peninjauan (Reviewing)',
                                'resolved' => 'Telah Diselesaikan (Resolved)',
                                'rejected' => 'Laporan Ditolak / Tidak Terbukti (Rejected)',
                            ])
                            ->required(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu Lapor')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('reporter.name')
                    ->label('Pelapor')
                    ->searchable(),
                Tables\Columns\TextColumn::make('reason')
                    ->label('Alasan')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'spam' => 'danger',
                        'impersonation' => 'warning',
                        'hate_speech' => 'danger',
                        default => 'secondary',
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('reportable_type')
                    ->label('Tipe Konten')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('description')
                    ->label('Keterangan')
                    ->limit(45)
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (ReportStatus|string $state): string => match ($state instanceof ReportStatus ? $state->value : $state) {
                        'pending' => 'danger',
                        'reviewing' => 'warning',
                        'resolved' => 'success',
                        'rejected' => 'gray',
                        default => 'gray',
                    }),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter Status')
                    ->options([
                        'pending' => 'Menunggu Tindakan',
                        'reviewing' => 'Dalam Peninjauan',
                        'resolved' => 'Selesai',
                        'rejected' => 'Ditolak',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('lock_thread')
                    ->label('Kunci Topik')
                    ->icon('heroicon-o-lock-closed')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->visible(fn (Report $record): bool => str_contains($record->reportable_type, 'ForumThread') && $record->status !== ReportStatus::RESOLVED)
                    ->action(function (Report $record): void {
                        ForumThread::where('id', $record->reportable_id)->update(['is_locked' => true]);
                        $record->update([
                            'status' => ReportStatus::RESOLVED,
                            'resolved_by' => auth()->id(),
                            'resolved_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Topik Berhasil Dikunci')
                            ->body('Topik forum telah dikunci dan laporan ditandai selesai.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('takedown')
                    ->label('Takedown')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (Report $record): bool => $record->status !== ReportStatus::RESOLVED)
                    ->action(function (Report $record): void {
                        if (str_contains($record->reportable_type, 'ForumPost')) {
                            ForumPost::where('id', $record->reportable_id)->delete();
                        } elseif (str_contains($record->reportable_type, 'ForumThread')) {
                            ForumThread::where('id', $record->reportable_id)->delete();
                        }

                        $record->update([
                            'status' => ReportStatus::RESOLVED,
                            'resolved_by' => auth()->id(),
                            'resolved_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Konten Telah Ditakedown')
                            ->body('Konten spam berhasil dihapus dari komunitas.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('dismiss')
                    ->label('Abaikan')
                    ->icon('heroicon-o-x-mark')
                    ->color('gray')
                    ->visible(fn (Report $record): bool => $record->status === ReportStatus::PENDING || $record->status === ReportStatus::REVIEWING)
                    ->action(function (Report $record): void {
                        $record->update([
                            'status' => ReportStatus::REJECTED,
                            'resolved_by' => auth()->id(),
                            'resolved_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Laporan Ditutup')
                            ->body('Laporan ditandai sebagai tidak terbukti.')
                            ->info()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListReports::route('/'),
        ];
    }
}
