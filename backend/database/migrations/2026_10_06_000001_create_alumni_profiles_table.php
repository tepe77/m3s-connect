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
        Schema::create('alumni_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->smallInteger('graduation_year')->index();
            $table->string('graduation_class')->nullable();
            $table->string('alumni_identifier')->unique()->nullable();
            $table->string('gender')->nullable();
            $table->date('birth_date')->nullable();
            $table->text('bio')->nullable();
            $table->string('current_city')->nullable()->index();
            $table->string('current_country')->nullable();
            $table->string('occupation')->nullable()->index();
            $table->string('company')->nullable()->index();
            $table->string('visibility')->default('public'); // public, members, private
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index(['graduation_year', 'current_city']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_profiles');
    }
};
