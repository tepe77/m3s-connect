<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Release slugs for any existing soft-deleted events so they do not collide with new records
        $deletedEvents = DB::table('events')
            ->whereNotNull('deleted_at')
            ->get(['id', 'slug', 'deleted_at']);

        foreach ($deletedEvents as $item) {
            if (! str_contains($item->slug, '-deleted-')) {
                $suffix = strtotime($item->deleted_at) ?: time();
                DB::table('events')
                    ->where('id', $item->id)
                    ->update([
                        'slug' => $item->slug . '-deleted-' . $suffix,
                    ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No down migration required
    }
};
