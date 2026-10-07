<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('forum_categories', function (Blueprint $table) {
            if (!Schema::hasColumn('forum_categories', 'color')) {
                $table->string('color', 30)->default('#0D9488')->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('forum_categories', function (Blueprint $table) {
            if (Schema::hasColumn('forum_categories', 'color')) {
                $table->dropColumn('color');
            }
        });
    }
};
