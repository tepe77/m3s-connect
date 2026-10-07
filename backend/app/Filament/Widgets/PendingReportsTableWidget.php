<?php

namespace App\Filament\Widgets;

use App\Enums\ReportStatus;
use App\Filament\Resources\ReportResource;
use App\Models\ForumPost;
use App\Models\ForumThread;
use App\Models\Report;
use Filament\Notifications\Notification;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingReportsTableWidget extends BaseWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Laporan Spam & Konten Mencurigakan Aktif';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Report::query()
                    ->where('status', ReportStatus::PENDING)
                    ->with('reporter')
                    ->latest()
            )
            ->heading('Laporan Spam & Konten Mencurigakan Aktif')
            ->description('Laporan dari anggota komunitas yang membutuhkan tindakan moderasi cepat.')
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Waktu Lapor')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('reporter.name')
                    ->label('Pelapor')
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\TextColumn::make('reason')
                    ->label('Alasan Pelanggaran')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'spam' => 'danger',
                        'impersonation' => 'warning',
                        'hate_speech' => 'danger',
                        default => 'secondary',
                    }),

                Tables\Columns\TextColumn::make('reportable_type')
                    ->label('Tipe Konten')
                    ->formatStateUsing(fn (string $state): string => class_basename($state))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('description')
                    ->label('Keterangan Pelapor')
                    ->limit(55)
                    ->placeholder('Tanpa catatan tambahan'),
            ])
            ->actions([
                Tables\Actions\Action::make('lock')
                    ->label('Kunci Topik')
                    ->icon('heroicon-o-lock-closed')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->visible(fn (Report $record): bool => str_contains($record->reportable_type, 'ForumThread'))
                    ->action(function (Report $record): void {
                        ForumThread::where('id', $record->reportable_id)->update(['is_locked' => true]);
                        $record->update([
                            'status' => ReportStatus::RESOLVED,
                            'resolved_by' => auth()->id(),
                            'resolved_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Topik Berhasil Dikunci')
                            ->body('Topik forum telah dikunci dan laporan diselesaikan.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('takedown')
                    ->label('Takedown')
                    ->icon('heroicon-o-trash')
                    ->color('danger')
                    ->requiresConfirmation()
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
                            ->title('Konten Spam Telah Dihapus')
                            ->body('Konten yang dilaporkan telah dihapus dari sistem.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('dismiss')
                    ->label('Abaikan')
                    ->icon('heroicon-o-x-mark')
                    ->color('gray')
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
            ])
            ->headerActions([
                Tables\Actions\Action::make('view_all_reports')
                    ->label('Buka Semua Laporan')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(ReportResource::getUrl('index')),
            ])
            ->emptyStateHeading('Tidak Ada Laporan Spam')
            ->emptyStateDescription('Komunitas alumni berada dalam keadaan kondusif dan bebas dari laporan pelanggaran.')
            ->emptyStateIcon('heroicon-o-shield-check');
    }
}
