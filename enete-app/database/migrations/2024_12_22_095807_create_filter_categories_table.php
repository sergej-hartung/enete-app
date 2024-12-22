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
        Schema::create('filter_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Название категории (например, "Диапазон цены")
            $table->string('filter_type'); // Тип фильтра (например, "range" или "exact_match")
            $table->string('description')->nullable(); // Описание категории
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_categories');
    }
};
