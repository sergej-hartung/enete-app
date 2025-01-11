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
        Schema::create('tariff_sorting_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tariff_id')->constrained('tariffs')->onDelete('cascade'); // Тариф
            $table->foreignId('sorting_criteria_id')->constrained('group_sorting_criteria')->onDelete('cascade'); // Критерий
            $table->decimal('value', 10, 2); // Значение
            $table->boolean('include_hardware')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_sorting_values');
    }
};
