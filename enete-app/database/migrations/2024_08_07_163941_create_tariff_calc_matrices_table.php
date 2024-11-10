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
        Schema::create('tariff_calc_matrices', function (Blueprint $table) {
            $table->id();
            $table->string('uniqueId');
            $table->unsignedBigInteger('tariff_id')->nullable(); 
            $table->string('name');
            $table->decimal('total_value', 15, 2);
            $table->string('unit');
            //$table->integer('position');
            $table->timestamps();

            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_calc_matrices');
    }
};
