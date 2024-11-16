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
        Schema::create('tariff_group_attribute_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->nullable()->constrained('tariff_groups');
            $table->foreignId('attribute_id')->nullable()->constrained('tariff_attributes');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_group_attribute_mappings');
    }
};
