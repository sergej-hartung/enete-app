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
        Schema::create('filter_sort_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('attribute_id')->nullable(); // Ссылка на атрибут
            $table->unsignedBigInteger('matrix_id')->nullable(); // Ссылка на матрицу
            $table->unsignedBigInteger('category_id'); // Ссылка на категорию
            $table->enum('source', ['attribute', 'matrix'])->default('attribute'); // Источник данных
            $table->enum('type', ['sort', 'filter']); // Тип связи
            $table->timestamps();

            // Связи
            $table->foreign('attribute_id')->references('id')->on('tariff_attributes')->onDelete('cascade');
            $table->foreign('matrix_id')->references('id')->on('tariff_calc_matrices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_sort_mappings');
    }
};
