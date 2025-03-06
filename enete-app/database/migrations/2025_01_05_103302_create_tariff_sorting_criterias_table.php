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
        Schema::create('tariff_sorting_criterias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('tariff_groups')->onDelete('cascade'); // Группа тарифов
            $table->string('name'); // Название критерия
            //$table->boolean('include_hardware')->default(false); // Учитывать ли стоимость оборудования
            $table->text('description')->nullable(); // Описание
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_sorting_criterias');
    }
};
