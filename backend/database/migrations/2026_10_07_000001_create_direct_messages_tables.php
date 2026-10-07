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
        Schema::create('direct_message_threads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_one_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('user_two_id')->constrained('users')->cascadeOnDelete();
            $table->string('subject')->default('Pesan Alumni');
            $table->text('last_message_content')->nullable();
            $table->timestamp('last_message_at')->nullable()->index();
            $table->unsignedInteger('user_one_unread')->default(0);
            $table->unsignedInteger('user_two_unread')->default(0);
            $table->timestamps();

            $table->index(['user_one_id', 'user_two_id']);
        });

        Schema::create('direct_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('thread_id')->constrained('direct_message_threads')->cascadeOnDelete();
            $table->foreignUuid('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('recipient_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_read')->default(false)->index();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['thread_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direct_messages');
        Schema::dropIfExists('direct_message_threads');
    }
};
