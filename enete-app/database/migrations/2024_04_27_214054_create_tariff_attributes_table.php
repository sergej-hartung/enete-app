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
        Schema::create('tariff_attributes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->string('name')->nullable();
            $table->unsignedBigInteger('input_type_id')->nullable();
            $table->string('unit')->nullable();
            $table->boolean('is_system')->nullable();
            $table->boolean('is_required')->nullable();
            $table->boolean('is_frontend_visible')->nullable();
            $table->unsignedBigInteger('tariff_id')->nullable();
            $table->json('details')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('input_type_id')->references('id')->on('tariff_attribute_types')->onDelete('set null');
            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('set null');
            
            // Shortened index name
            $table->index(['input_type_id', 'tariff_id', 'created_by', 'updated_by'], 'attributes_main_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_attributes');
    }
};
