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
        Schema::create('tariff_tpls', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tariff_id')->nullable();
            $table->unsignedBigInteger('matrix_id')->nullable(); // Ссылка на таблицу `matrix`
            $table->unsignedBigInteger('attribute_id')->nullable(); // Ссылка на таблицу `attributes`
            $table->boolean('auto_field_name')->default(false);
            $table->boolean('auto_unit')->default(false);
            $table->boolean('auto_value_source')->default(false);
            $table->boolean('custom_field')->default(false);
            $table->string('icon')->nullable();
            $table->boolean('is_matrix')->default(false);
            $table->string('manual_field_name')->nullable();
            $table->string('manual_unit')->nullable();
            $table->string('manual_value')->nullable();
            $table->integer('position')->nullable();
            $table->boolean('show_field_name')->default(false);
            $table->boolean('show_icon')->default(false);
            $table->boolean('show_unit')->default(false);
            $table->boolean('show_value')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
            
            // Определяем внешние ключи
            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('set null');
            $table->foreign('matrix_id')->references('id')->on('tariff_calc_matrices')->onDelete('set null');
            $table->foreign('attribute_id')->references('id')->on('tariff_attributes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_tpls');
    }
};
