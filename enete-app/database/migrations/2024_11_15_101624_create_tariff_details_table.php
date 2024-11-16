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
        Schema::create('tariff_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tariff_id')->nullable();
            $table->unsignedBigInteger('tariff_attribute_group_id')->nullable();
            $table->integer('position')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('tariff_id')->references('id')->on('tariffs')->onDelete('set null');
            $table->foreign('tariff_attribute_group_id')->references('id')->on('tariff_attribute_groups')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_details');
    }
};
