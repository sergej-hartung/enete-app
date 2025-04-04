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
        Schema::create('tariff_commission_group_mappings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('commission_id');
            $table->unsignedBigInteger('group_id');
            $table->float('difference');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();  // Создает created_at и updated_at
            $table->softDeletes();
        
            $table->foreign('commission_id')->references('id')->on('tariff_commissions');
            $table->foreign('group_id')->references('id')->on('tariff_commission_groups');
            $table->index('commission_id');
            $table->index('group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tariff_commission_group_mappings');
    }
};
