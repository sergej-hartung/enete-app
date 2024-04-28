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
        Schema::create('tariff_attribute_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tariff_id')->nullable();
            $table->unsignedBigInteger('attribute_id')->nullable();
            $table->string('value_varchar', 255)->nullable();
            $table->text('value_text')->nullable();
            $table->boolean('is_active')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('set null');
            $table->foreign('attribute_id')->references('id')->on('tariff_attributes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_attribute_mappings');
    }
};
