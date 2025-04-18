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
        Schema::create('calc_matrix_attribute_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calc_matrix_id')->nullable();
            $table->unsignedBigInteger('attribute_id')->nullable();
            $table->string('period')->nullable();
            $table->string('periodeTyp')->nullable();
            $table->boolean('single');
            $table->string('unit')->nullable();
            $table->string('value')->nullable();
            $table->decimal('value_total', 15, 2);
            $table->integer('position');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('calc_matrix_id')->references('id')->on('tariff_calc_matrices')->onDelete('set null');
            $table->foreign('attribute_id')->references('id')->on('tariff_attributes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calc_matrix_attribute_mappings');
    }
};
