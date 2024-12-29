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
        Schema::create('sort_category_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sort_category_id')->nullable(); // Ссылка на атрибут
            $table->unsignedBigInteger('tariff_matrix_id')->nullable(); // Ссылка на атрибут
            $table->unsignedBigInteger('tariff_attribute_id')->nullable(); // Ссылка на матрицу
            $table->enum('source', ['matrix', 'attribute']); // Ссылка на категорию
            $table->timestamps();

            // Связи
            $table->foreign('tariff_attribute_id')->references('id')->on('tariff_attributes')->onDelete('cascade');
            $table->foreign('tariff_matrix_id')->references('id')->on('tariff_calc_matrices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sort_category_mappings');
    }
};
