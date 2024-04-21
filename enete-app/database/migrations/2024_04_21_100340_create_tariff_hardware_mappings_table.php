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
        Schema::create('tariff_hardware_mappings', function (Blueprint $table) {
            $table->id();
            // $table->unsignedBigInteger('tariff_id')->nullable();
            // $table->unsignedBigInteger('hardware_id')->nullable();
            // $table->double('purchase_price', 8, 2)->nullable();
            // $table->unsignedBigInteger('created_by')->nullable();
            // $table->unsignedBigInteger('updated_by')->nullable();
            // $table->timestamps();
        
            // $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('cascade');
            // $table->foreign('hardware_id')->references('id')->on('hardware')->onDelete('cascade');

            // // Indexes
            // $table->index('tariff_id');
            // $table->index('hardware_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_hardware_mappings');
    }
};
