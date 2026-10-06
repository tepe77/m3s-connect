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
        Schema::create('alumni_educations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('alumni_profile_id')->constrained('alumni_profiles')->cascadeOnDelete();
            $table->string('institution');
            $table->string('degree')->nullable();
            $table->string('field_of_study')->nullable();
            $table->smallInteger('start_year');
            $table->smallInteger('end_year')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['institution', 'start_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_educations');
    }
};
